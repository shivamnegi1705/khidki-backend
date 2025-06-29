# Render Deployment Guide

This guide will help you deploy your Khidki backend application to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Create a New Web Service

1. Log in to your Render dashboard
2. Click on "New" and select "Web Service"
3. Connect your Git repository
4. Select the repository containing your Khidki backend code

### 2. Configure Your Web Service

Fill in the following details:
- **Name**: khidki-backend (or your preferred name)
- **Environment**: Node
- **Region**: Choose the region closest to your users
- **Branch**: main (or your default branch)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Choose the appropriate plan (Free tier is available for testing)

### 3. Set Environment Variables

In the "Environment" section, add the following environment variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
FRONTEND_URL=your-frontend-url
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-secret-key
```

If you're using Google OAuth, also add:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-render-app-url.onrender.com/api/user/auth/google/callback
```

If you're using payment gateways, add:
```
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 4. Deploy Your Service

Click "Create Web Service" to start the deployment process. Render will automatically build and deploy your application.

## Updating Your Frontend

Update your frontend application to use the new Render backend URL:

1. Update the API endpoint in your frontend code to point to your Render URL
2. Update CORS settings in your frontend if necessary

## Troubleshooting

### MongoDB Connection Issues

If you're having trouble connecting to MongoDB:

1. Ensure your MongoDB connection string is correct
2. Make sure your MongoDB Atlas cluster allows connections from anywhere (or specifically from Render's IP ranges)
3. Check if your MongoDB user has the correct permissions

### Session Configuration Issues

If you're experiencing session-related issues:

1. Make sure your session configuration is correct for Render:

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

### Google OAuth Issues

If Google OAuth is not working:

1. Update your Google OAuth configuration in the Google Cloud Console:
   - Add your Render deployment URL to the authorized JavaScript origins
   - Update your callback URL to point to your Render URL
   - Update the GOOGLE_CALLBACK_URL environment variable in Render

### Checking Logs

To troubleshoot issues:

1. Go to your Render dashboard
2. Select your web service
3. Click on "Logs" to view the application logs
4. Look for error messages that might help identify the issue

## Monitoring Your Application

Render provides basic monitoring for your application:

1. Go to your Render dashboard
2. Select your web service
3. Click on "Metrics" to view CPU, memory, and network usage

## Scaling Your Application

If you need to scale your application:

1. Go to your Render dashboard
2. Select your web service
3. Click on "Settings"
4. Under "Instance Type", select a higher tier plan

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables on Render](https://render.com/docs/environment-variables)
