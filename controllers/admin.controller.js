require("dotenv").config();
const pool = require("../config/db.js");
const generateAdminToken = require("../utils/generateAdminToken.js");
const bcrypt = require("bcrypt");

const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    const adminQuery = `INSERT INTO admins (username, password) VALUES ($1, $2)`;
    const adminQueryParams = [username, hashedPassword];
    const adminQueryData = await pool.query(adminQuery, adminQueryParams);

    res.status(201).json({
      success: true,
      error: false,
      message: "Admin Created Successfully.",
    });
  } catch (error) {
    if (error.code === "23505") {
      res.status(400).json({
        error: true,
        message: "Admin with these details already exists",
      });
    } else {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error!" });
    }
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const adminQuery = `SELECT * FROM admins WHERE username = $1`;
    const adminQueryParams = [username];
    const adminQueryData = await pool.query(adminQuery, adminQueryParams);

    if (adminQueryData.rowCount === 1) {
      const auth = await bcrypt.compare(
        password,
        adminQueryData.rows[0].password
      );

      if (auth) {
        const token = await generateAdminToken(adminQueryData.rows[0].id);
        const admin = adminQueryData.rows[0];
        delete admin.password;

        res.status(200).json({
          success: true,
          error: false,
          message: "Admin Login Successful",
          data: { token, admin },
        });
      } else {
        res.status(400).json({
          error: true,
          success: false,
          message: "Password is Incorrect",
        });
      }
    } else {
      res
        .status(404)
        .json({ success: false, error: true, message: "Admin Not Found!" });
    }
  } catch (error) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, error: true, message: "Internal Server Error!" });
  }
};

module.exports = { createAdmin, login };
