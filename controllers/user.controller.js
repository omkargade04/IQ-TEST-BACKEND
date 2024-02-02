require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const pool = require("../config/db.js");
const { Snowflake } = require("@theinternetfolks/snowflake");
const generateUserToken = require("../utils/generateUserToken.js");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || name.length < 2) {
      return res
        .status(400)
        .json({ status: false, content: { message: "Invalid name" } });
    }
    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ status: false, content: { message: "Invalid email" } });
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ status: false, content: { message: "Invalid password" } });
    }

    const timestamp = new Date();
    console.log(req.body);
    const userId = Snowflake.generate();

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT)
    );

    const userQuery = `INSERT INTO users(id, name, email, password, created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const userQueryParams = [userId, name, email, hashedPassword, timestamp];
    const userQueryData = await pool.query(userQuery, userQueryParams);
    const token = await generateUserToken(userQueryData.rows[0].id);
    delete userQueryData.passsword;

    res.status(201).json({
      status: true,
      content: {
        data: {
          id: userQueryData.rows[0].id,
          name: userQueryData.rows[0].name,
          email: userQueryData.rows[0].email,
          created_at: userQueryData.rows[0].created_at.toISOString(),
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    //console.log(req.body);
    if (error.code === "23505") {
      res
        .status(400)
        .json({ status: false, content: { message: "User already exists" } });
    } else {
      console.error("Error during signup:", error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }
  if (!email || !validator.isEmail(email)) {
    return res
      .status(400)
      .json({ status: false, content: { message: "Invalid email" } });
  }
  if (!password) {
    return res
      .status(400)
      .json({ status: false, content: { message: "Password is required" } });
  }

  try {
    const userQuery = `SELECT * FROM users WHERE email = $1`;
    const userQueryParams = [email];
    console.log(email);
    console.log(password);
    const userQueryData = await pool.query(userQuery, userQueryParams);

    if (userQueryData.rowCount === 1) {
      const auth = await bcrypt.compare(
        password,
        userQueryData.rows[0].password
      );

      if (auth) {
        const token = await generateUserToken(userQueryData.rows[0].id);
        const user = userQueryData.rows[0];
        delete user.password;
        res.status(201).json({
          status: true,
          content: {
            data: {
              id: userQueryData.rows[0].id,
              name: userQueryData.rows[0].name,
              email: userQueryData.rows[0].email,
            },
            meta: {
              access_token: token,
            },
          },
        });
      } else {
        res.status(400).json({ error: true, message: "Password Not Correct" });
      }
    } else {
      res.status(404).json({ error: true, message: "User Not Found!" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const queryUser = `SELECT * FROM users WHERE id=$1 RETURNING id`;
    const queryUserParams = [userId];
    const userQueryData = await pool.query(queryUser, queryUserParams);
    res.status(201).json({
      status: true,
      content: {
        data: {
          id: userQueryData.rows[0].id,
          name: userQueryData.rows[0].name,
          email: userQueryData.rows[0].email,
          created_at: userQueryData.rows[0].created_at.toISOString(),
        },
      },
    });
  } catch (error) {
    //console.log(req.body);
    if (error.code === "23505") {
      res
        .status(400)
        .json({ status: false, content: { message: "User already exists" } });
    } else {
      console.error("Error getting users:", error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  }
};

module.exports = { signup, login, getUser };
