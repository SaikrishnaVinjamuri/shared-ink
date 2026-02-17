const mongoose = require('mongoose');
const User = require('../models/userModel');
const blog = require('../models/blogModel');
const RefreshToken = require('../models/refreshTokenModel');

const getMyProfile = async (req, res) => {
    try {
        const userId = req.user?.userID || req.user?.userId
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }  
        res.status(200).json({ user })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        res.status(500).json({ message: 'Server error' })
    }  
}

const getAllUsers = async (req, res) => {
    try {
        const userId = req.user?.userID || req.user?.userId
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1)* limit
        const filter = { _id: { $ne: userId } }
        const [users, totalUsers] = await Promise.all([
            User.find(filter).sort({ username: 1 }).skip(skip).limit(limit).select('-password'),
            User.countDocuments(filter)
        ])
        res.status(200).json({
            currentPage : page,
            limit,
            totalUsers,
            totalPages : Math.ceil(totalUsers/limit),
            users
        })
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({ message: 'Server error' })
    }   
}

const deleteUser = async(req,res) => {
    try{
        const {id}= req.params 
        if(!mongoose.isValidObjectId(id)){
            return res.status(400).json({message:'Invalid user id'})
        }   
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({message:'User not found'})
        }   
        await Promise.all([
            blog.deleteMany({ authorId: id }),
            RefreshToken.deleteMany({ userId: id }),
            User.findByIdAndDelete(id),
            ]);
        return res.status(200).json({message:'User and associated blogs deleted successfully'})
    }catch(error){
        console.error('Error deleting user:', error)
        return res.status(500).json({message:'Server error'})
    }
}

module.exports = {
    getMyProfile,
    getAllUsers,
    deleteUser
}