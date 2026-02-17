const express = require('express')
const router = express.Router()
const {verifyToken, authorizeRole} = require('../middleware/authMiddleware')
const {createBlog, getBlogByID, getAllBlogs, getBlogByUser, updateBlog, deleteBlog} = require('../controllers/blogController')

router.get('/',getAllBlogs)
router.get('/users/:id/blog',getBlogByUser)
router.get('/:id',getBlogByID)

router.post('/new-blog',verifyToken,createBlog)
router.post('/update/:id',verifyToken,updateBlog)
router.delete('/delete/:id',verifyToken,deleteBlog)

module.exports = router