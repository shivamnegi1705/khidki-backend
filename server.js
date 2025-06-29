import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import session from 'express-session'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import passport from './config/passport.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
    origin: function(origin, callback) {
        // Allow any origin
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
}))

// Session configuration
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}))

// Initialize passport (only if needed)
app.use(passport.initialize())

// Handle potential errors
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
    });
});

// Handle OPTIONS requests for CORS preflight
app.options('*', cors());

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

// Listen on the specified port
app.listen(port, () => console.log('Server started on PORT : ' + port))

// Export the Express app
export default app
