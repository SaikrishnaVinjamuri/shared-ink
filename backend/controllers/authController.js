const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const RefreshToken = require('../models/refreshTokenModel')

//register user
const register = async(req, res) => {
    try{
        const {username, email, password} = req.body

        if(!username || !email || !password) {
            return res.status(400).json({message: 'All the fields are required'})
        }
        try{
            const findUser = await User.findOne({ $or : [{username}, {email}]})
            if(findUser){
                return res.status(400).json({message: "User alreay exists"})
            }
            if(password.length<6){
                return res.status(400).json({message: "Password must be length of minimum 6"})
            }

            const hashedPassword = await bcrypt.hash(password,10)
            const newUser = new User({username, email, password: hashedPassword})
            await newUser.save()

            res.status(201).json({message: "User registered successfully",
                user:{
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role
                }
            })

        }catch(error){
            res.status(500).json({message: "server error"})
        }
    }catch(error){
        res.status(500).json({message: "server error"})
    }
}

//login user
const login  = async(req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({message:'All the fields are required'})
        }
        const findUser = await User.findOne({email})
        if(!findUser){
            return res.status(400).json({message:"User does not exists"})
        }
        const isPasswordMatch = await bcrypt.compare(password, findUser.password) 
        if(!isPasswordMatch){
            return res.status(401).json({message: "Invalid email or Password"})
        }

        const accessToken = jwt.sign({
            userId: findUser._id, username: findUser.username, role: findUser.role
        }, process.env.ACCESSTOKEN_SECRET, {expiresIn: '20m'})

        const refreshToken = jwt.sign({
            userId: findUser._id, username: findUser.username, role: findUser.role
        }, process.env.REFRESHTOKEN_SECRET, {expiresIn:'7d'})

        await RefreshToken.deleteMany({userId: findUser._id})

        const newRefreshToken = new RefreshToken({ token: refreshToken, userId: findUser._id})
        await newRefreshToken.save()

        const isProd = process.env.NODE_ENV === "production";
        res.cookie('refreshToken',refreshToken,{
            httpOnly: true, secure: isProd?true:false, sameSite: isProd?'Strict':'Lax', maxAge: 7*24*60*60*1000
        })

        res.status(200).json({
            message: "loggedIn successfully",
            accessToken,
            user: {
                userId: findUser._id,
                username: findUser.username,
                email: findUser.email,
                role: findUser.role
            }
        })
    }catch(error){
        res.status(500).json({message:' Server error'})
    }
}


const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        console.log("Received refresh token:", token);
        if(!token) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }
        jwt.verify(token, process.env.REFRESHTOKEN_SECRET, async (err, decoded) => {
            if(err) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }
            await RefreshToken.findOneAndDelete({ token });
            const newAccessToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, process.env.ACCESSTOKEN_SECRET, { expiresIn: '20m' });
            const newRefreshToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, process.env.REFRESHTOKEN_SECRET, { expiresIn: '7d' });
            await RefreshToken.findOneAndUpdate(
                { userId: decoded.userId },
                { token: newRefreshToken, createdAt: new Date() },
                { new: true, upsert: true }
            );

            const isProd = process.env.NODE_ENV === "production";
            res.cookie('refreshToken', newRefreshToken, { 
                httpOnly: true, secure: isProd?true:false, sameSite: isProd?'Strict':'Lax', maxAge: 7*24*60*60*1000 
            });
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


const logoutUser = async (req, res) => {    
    try {
        const token = req.cookies.refreshToken; 
        if(token) {
            await RefreshToken.findOneAndDelete({ token });
        }   
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }       
};

module.exports = { logoutUser, refreshToken, register, login}