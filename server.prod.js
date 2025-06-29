import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import passport from './config/passport.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'] : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Session configuration
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true,
        sameSite: 'none'
    }
}))

// Initialize passport
app.use(passport.initialize())

// API endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// Serve admin static files
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')))

// Handle frontend routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

// Handle admin routes
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/dist/index.html'))
})

// Catch-all route for frontend client-side routing
app.get('*', (req, res) => {
    // Exclude API routes and admin routes
    if (!req.path.startsWith('/api') && !req.path.startsWith('/admin')) {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    } else if (req.path.startsWith('/admin')) {
        res.sendFile(path.join(__dirname, '../admin/dist/index.html'))
    }
})

app.listen(port, () => console.log('Server started on PORT: ' + port))
