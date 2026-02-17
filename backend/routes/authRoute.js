const express = require("express");
const router = express.Router();
const {register, login, refreshToken, logoutUser} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.post('/logout', logoutUser)  

module.exports = router;