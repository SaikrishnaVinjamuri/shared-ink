const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dbConnect = require('./config/db')
const authRoute = require('./routes/authRoute')
const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
const path = require('path')

dotenv.config()

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:5173', 'https://shared-ink.onrender.com'],
  credentials: true,
}))

// Ensure DB connected before every request (safe for serverless — returns instantly if already connected)
app.use(async (req, res, next) => {
  try {
    await dbConnect()
    next()
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' })
  }
})

app.use('/api/auth', authRoute)
app.use('/api/blogs', blogRoutes)
app.use('/api/users', userRoutes)

// Serve frontend only in non-Vercel environments (Render, local production build)
if (!process.env.VERCEL) {
  const _dirname = path.resolve()
  app.use(express.static(path.join(_dirname, '/frontend/dist')))
  app.use((req, res) => {
    res.sendFile(path.join(_dirname, '/frontend/dist/index.html'))
  })
}

// Start server when run directly (local dev / Render)
if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Server running on port ${port}`))
}

module.exports = app
