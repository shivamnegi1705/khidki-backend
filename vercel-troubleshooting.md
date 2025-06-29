# Vercel Deployment Troubleshooting Guide

## Current Issue: "This Serverless Function has crashed"

You're currently seeing an error message: "This Serverless Function has crashed" with a 500 INTERNAL_SERVER_ERROR and code "FUNCTION_INVOCATION_FAILED". This is a common issue when deploying Node.js applications to Vercel's serverless environment.

## Potential Causes and Solutions

### 1. Environment Variables Not Set

**Problem**: Your application requires environment variables that aren't set in Vercel.

**Solution**:
1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add all required environment variables from your `.env.example` file
4. Redeploy your application

### 2. MongoDB Connection Issues

**Problem**: The application can't connect to MongoDB.

**Solution**:
1. Verify your MongoDB connection string in Vercel environment variables
2. Ensure your MongoDB Atlas cluster allows connections from anywhere (or specifically from Vercel's IP ranges)
3. Check if your MongoDB user has the correct permissions
4. Update your MongoDB connection code to handle connection errors gracefully:

```javascript
// In config/mongodb.js
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("DB Connected");
        });
        
        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
        });
        
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
            serverSelectionTimeoutMS: 5000,
            retryWrites: true
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

export default connectDB;
```

### 3. Serverless Function Timeout

**Problem**: Your initialization code might be taking too long to execute.

**Solution**:
1. Move database connections to API route handlers instead of the main file
2. Use lazy loading for heavy modules
3. Increase the function timeout in Vercel (if you're on a paid plan)

### 4. Session Configuration Issues

**Problem**: Express session might not be configured correctly for serverless environments.

**Solution**:
1. Update your session configuration to be compatible with serverless:

```javascript
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))
```

### 5. Vercel Build Configuration

**Problem**: The build configuration in vercel.json might not be correct.

**Solution**:
1. We've already updated your vercel.json file with better configuration
2. Make sure to redeploy after these changes

### 6. Check Vercel Logs

**Problem**: The error message doesn't provide enough information.

**Solution**:
1. Go to your Vercel project dashboard
2. Navigate to "Deployments" > [latest deployment] > "Functions"
3. Click on the function that's failing
4. Check the logs for more detailed error information

## Steps to Fix the Current Issue

1. **Redeploy with Updated Configuration**: We've made changes to your `vercel.json` and `server.js` files to better handle serverless environments. Redeploy your application with these changes.

2. **Check Environment Variables**: Make sure all required environment variables are set in Vercel.

3. **Verify MongoDB Connection**: Ensure your MongoDB connection string is correct and your database is accessible.

4. **Check Vercel Logs**: After redeploying, check the Vercel logs for more detailed error information.

5. **Test API Endpoints**: Use the curl commands provided in `test-api.md` to test your API endpoints after redeploying.

## If Issues Persist

If you continue to experience issues after following these steps, consider the following:

1. **Simplify Your Application**: Temporarily comment out non-essential parts of your application to identify the problematic component.

2. **Local Testing**: Test your application locally with the same environment variables to see if the issue is specific to Vercel.

3. **Contact Vercel Support**: If all else fails, contact Vercel support with your deployment ID and error logs.
