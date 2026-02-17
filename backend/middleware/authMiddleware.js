const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({message:'No Token provided'})
    }
    
    jwt.verify(token, process.env.ACCESSTOKEN_SECRET, (err, user)=>{
        if(err) return res.status(403).json({message:'Invalid Token'})
        req.user = user
        next()
    })
}

const authorizeRole = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role ){ 
            return res.status(403).json({message:'Access Denied'})
        }
        next()
    }   
}

module.exports = {verifyToken, authorizeRole}