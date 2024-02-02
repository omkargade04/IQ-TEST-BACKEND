const express = require("express");
const router = express.Router();

const { createAdmin, login } = require("../controllers/admin.controller");

const { isAdminAuthenticated } = require("../middlewares/admin.middleware");

router.post("/signup", isAdminAuthenticated, createAdmin);
router.post("/login", login);

module.exports = router;
