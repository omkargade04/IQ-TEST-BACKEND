require("dotenv").config();
const pool = require("../config/db.js");
const jwt = require("jsonwebtoken");

const generateAdminToken = async (adminId) => {
  try {
    const timestamp = new Date();
    const token = jwt.sign({ id: adminId }, process.env.TOKEN_SECRET);
    const query = `INSERT INTO admin_token(token, fk_admin, created_at) VALUES ($1, $2, $3)`;
    const queryParams = [token, adminId, timestamp];

    await pool.query(query, queryParams);
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = generateAdminToken;
