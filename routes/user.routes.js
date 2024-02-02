const express = require('express')
const router = express.Router();
const {signup, login} = require('../controllers/user.controller.js');
const {isAuthenticated, validateUserData} = require("../middlewares/user.middleware.js");

router.post('/signup', isAuthenticated, validateUserData, signup);
router.post('/login', login);

module.exports = router