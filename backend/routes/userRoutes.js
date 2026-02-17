const express = require('express')
const router = express.Router()
const {verifyToken, authorizeRole} = require('../middleware/authMiddleware')
const {getMyProfile, getAllUsers, deleteUser} = require('../controllers/userController')

router.get('/me', verifyToken, getMyProfile)
router.get('/', verifyToken, authorizeRole('admin'), getAllUsers)
router.delete('/:id', verifyToken, authorizeRole('admin'), deleteUser)

module.exports = router