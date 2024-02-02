const pool = require("../config/db.js");

const isAdminAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.header.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, error: true, message: "Not Authenticated" });
    }

    const token = authHeader.replace("Bearer", "");
    const tokenQuery = `SELECT * FROM admin_token WHERE token = $1`;
    const tokenQueryParams = [token];
    const tokenQueryData = await pool.query(tokenQuery, tokenQueryParams);

    if (tokenQueryData.rowCount < 1) {
      return res
        .status(401)
        .json({ success: false, error: true, message: "Invalid Token!" });
    }

    const adminId = tokenQueryData.rows[0].fk_admin;
    const adminQuery = `SELECT username FROM admins WHERE id = $1`;
    const adminQueryParams = [adminId];
    const adminQueryData = await pool.query(adminQuery, adminQueryParams);

    req.admin = adminQueryData.rows[0];
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: true, success: false, message: "Internal Server Error" });
  }
};

module.exports = { isAdminAuthenticated };
