require("dotenv").config();
const { Snowflake } = require("@theinternetfolks/snowflake");
const pool = require("../config/db.js");
const jwt = require("jsonwebtoken");

const generateUserToken = async (userId) => {
  try {
    console.log(userId);
    const user_tokenId = Snowflake.generate();
    const timestamp = new Date();
    const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET);
    const query = `INSERT INTO user_token(id, token, fk_user, created_at) VALUES ($1, $2, $3, $4)`;
    const queryParams = [user_tokenId, token, userId, timestamp];

    await pool.query(query, queryParams);
    console.log(token);
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = generateUserToken;
