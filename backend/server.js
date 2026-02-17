const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/db')
const authRoute = require('./routes/authRoute')
const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/userRoutes')
const cors = require("cors");

dotenv.config()
dbConnect()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/api/auth',authRoute)
app.use('/api/blogs', blogRoutes)
app.use('/api/users', userRoutes)

app.listen(port, ()=>{
    console.log(`server is running port ${port}`)
})