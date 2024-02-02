const pool = require("../config/db.js");
const { Snowflake } = require("@theinternetfolks/snowflake");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};

const validatePassword = (password) => {
  if (password.length >= 8) {
    return true;
  }
  return false;
};

const validateUserData = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All field are required" });
  }

  if (validateEmail(email) && validatePassword(password)) {
    next();
  } else {
    res.status(400).json({ error: true, message: "Invalid Data" });
  }
};

const isAuthenticated = async (req, res, next) => {
  try {
    // const authorizationIndex = req.rawHeaders.findIndex((header) => header.startsWith('Bearer'));
    // const authorizationHeader = req.rawHeaders[authorizationIndex];
    // const authHeader = authorizationHeader;

    const authHeader = req.header.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ error: true, message: "Not Authenticated" });
    }

    const token = authHeader.replace("Bearer ", "");
    const tokenQueryParams = [token];
    const tokenQuery = `SELECT * FROM user_token WHERE token = $1`;
    const tokenQueryData = await pool.query(tokenQuery, tokenQueryParams);

    if (tokenQueryData.rowCount < 1) {
      return res.status(401).json({ error: true, message: "Invalid Token" });
    }

    const userId = tokenQueryData.rows[0].fk_user;
    const userQuery = `SELECT * FROM users WHERE id = $1`;
    const userQueryParams = [userId];
    const userQueryData = await pool.query(userQuery, userQueryParams);

    req.user = userQueryData.rows[0];
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  validateUserData,
  isAuthenticated,
};
