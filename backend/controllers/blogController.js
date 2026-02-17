
const mongoose = require('mongoose')
const Blog = require('../models/blogModel')

//create a blog 
const createBlog = async(req,res) =>{
    try{
        console.log(req.user)
        const userid = req.user?.userID || req.user?.userId
        if(!userid){
            return res.status(401).json({message:"unauthorizedd"})
        }
        const {title, content} = req.body
        if(!title || !content) {
            return res.status(400).json({message:'all the fields are required'})
        }

        if (title.trim().length < 3) {
            return res.status(400).json({ message: "Title must be at least 3 characters" });
        }
        if (content.trim().length < 10) {
            return res.status(400).json({ message: "Content must be at least 10 characters" });
        }

        const newBlog = new Blog({ title: title.trim(), content: content.trim(), authorId: userid })
        await newBlog.save()

        res.status(201).json({message: 'Blog added successfully'})
    }catch(error){
        res.status(500).json({message: 'Server error', error})
    }
}

//get a blog by ID
const getBlogByID = async(req, res) => {
    try{
        const {id} = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid blog iddd" });
        }
        const blog = await Blog.findById(id).populate("authorId","username role")
        if(!blog){
            return res.status(404).json({message: "Blog not found"})
        }
        return res.status(200).json({message:'Success',blog})
    }catch(error){
        return res.status(500).json({message:'Server error', error})
    }

}

//get all blogs
const getAllBlogs = async(req,res) =>{
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1)* limit
        const [blogs, totalBlogs] = await Promise.all([
            Blog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("authorId", "username"),
            Blog.countDocuments()
        ])
        res.status(200).json({
            currentPage : page,
            limit,
            totalBlogs,
            totalPages : Math.ceil(totalBlogs/limit),
            blogs
        })

    }catch(error){
        res.status(500).json({message: 'server error'})
    }
}

//get all blogs of a particular user
const getBlogByUser = async(req,res) => {
    try{
        const userId= req.params.id;
        // console.log(req.params)
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid userrr id" });
        }
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1)* limit
        const [blogs, totalBlogs] = await Promise.all([
            Blog.find({authorId: userId}).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("authorId", "username"),
            Blog.countDocuments({authorId: userId})
        ])

        res.status(200).json({
            currentPage : page,
            limit,
            totalBlogs,
            totalPages : Math.ceil(totalBlogs/limit),
            blogs
        })

    }catch(error){
        return res.status(500).json({message: "Server error"})
    }
}

//update blog
const updateBlog = async(req, res) => {
    try{
        const {id}= req.params
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({message:'Invaliddd user id'})
        }
        const userId = req.user?.userId || req.user?.userID
        console.log(userId)
        console.log(req.user)
        if(!userId){
            return res.status(401).json({message:'unauthorized'})
        }
        const blog = await Blog.findById(id)
        if(!blog){
            return res.status(404).json({message:'Blog not found'})
        }
        if(blog.authorId.toString() !== userId.toString()){
            return res.status(403).json({message: "Forbidden: you can only update your own blog"})
        }
        const {title, content} = req.body
        if(title === undefined && content === undefined) {
            return res.status(400).json({message:'Provide at least one field to update'})
        }

        if (title !== undefined) {
            if (title.trim().length < 3) {
                return res.status(400).json({ message: "Title must be at least 3 characters" });
            }
            blog.title = title.trim()
        }

        if (content !== undefined) {
            if (content.trim().length < 10) {
                return res.status(400).json({ message: "Content must be at least 10 characters" });
            }
            blog.content = content.trim()
        }
        
        await blog.save()

        res.status(201).json({message: 'Blog updated successfully',blog})

    }catch(error){
        return res.status(500).json({message: 'Server error'})
    }
}

//delete blog
const deleteBlog = async(req, res) => {
    try{
        const role = req.user?.role
        const {id}= req.params
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({message:'Invalid user id'})
        }
        const userId = req.user?.userId
        if(!userId){
            return res.status(401).json({message:'unauthorized'})
        }
        const blog = await Blog.findById(id)
        if(!blog){
            return res.status(404).json({message:'Blog not found'})
        }
        if(blog.authorId.toString() !== userId.toString() && role!=="admin"){
            return res.status(403).json({message: "Forbidden: you can only update your own blog"})
        }
        await Blog.findByIdAndDelete(id)

        return res.status(200).json({message: "blog deleted sucessfully"})
    }catch(error){
        return res.status(500).json({message: 'Server error'})
    }
}

module.exports = {createBlog, getBlogByID, getAllBlogs, getBlogByUser, updateBlog, deleteBlog}