const mongoose = require('mongoose')

const dbConnect = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongo DB connected successfully")
    }catch(error){
        console.log("can't connect to mongoDB", error)
        process.exit(1)
    }
}

module.exports = dbConnect