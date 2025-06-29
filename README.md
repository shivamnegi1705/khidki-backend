# Khidki Backend

This is the backend API for the Khidki e-commerce application.

## Deploying to Render

### Prerequisites

1. A [Render](https://render.com/) account
2. MongoDB Atlas account (for database)
3. Cloudinary account (for image storage)

### Step 1: Set Up Environment Variables in Render

Before deploying, you need to set up the following environment variables in your Render project:

1. Go to the [Render Dashboard](https://dashboard.render.com/)
2. Create a new Web Service or select your existing project
3. Go to "Environment" section
4. Add the following environment variables (refer to `.env.example` for the complete list):

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-mongodb-uri
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-frontend-url.onrender.com
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-secret-key
```

If you're using Google OAuth, also add:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.onrender.com/api/user/auth/google/callback
```

If you're using payment gateways, add the respective keys:
```
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Step 2: Deploy to Render

1. Go to the [Render Dashboard](https://dashboard.render.com/)
2. Click "New" > "Web Service"
3. Connect your Git repository or select "Public Git repository" and enter your repository URL
4. Configure the project:
   - Name: khidki-backend (or your preferred name)
   - Environment: Node
   - Region: Choose the region closest to your users
   - Branch: main (or your default branch)
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Choose the appropriate plan (Free tier is available for testing)
5. Click "Create Web Service"

Render will automatically build and deploy your application. You can monitor the deployment progress in the Render dashboard.

### Step 3: Update Frontend Configuration

After deploying your backend to Render, you'll get a deployment URL (e.g., `https://khidki-backend.onrender.com`).

1. Update your frontend API configuration to point to this URL:
   - In your frontend project, find where the API URL is defined
   - Replace the existing API URL with your Render deployment URL

2. Redeploy your frontend if necessary

### Step 4: Verify the Connection

1. Visit your frontend application
2. Test the functionality that requires backend API calls
3. Check the browser console for any CORS or connection errors

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Verify that your backend's CORS configuration includes your frontend domain
2. Check that the `FRONTEND_URL` environment variable is correctly set in Render
3. Ensure your frontend is making requests to the correct backend URL

### Database Connection Issues

If the application can't connect to MongoDB:

1. Verify your MongoDB Atlas connection string in the Render environment variables
2. Ensure your MongoDB Atlas cluster is accessible from Render's IP addresses
3. Check if your MongoDB Atlas user has the correct permissions

### Authentication Issues

If authentication is not working:

1. Verify that the `JWT_SECRET` is correctly set in Render
2. For Google OAuth, ensure the callback URL in your Google Cloud Console matches the one in your environment variables

### Checking Logs

To troubleshoot issues:

1. Go to your Render dashboard
2. Select your web service
3. Click on "Logs" to view the application logs
4. Look for error messages that might help identify the issue

## Local Development

To run the backend locally:

```
npm install
npm run server
```

The server will start on port 4000 by default.
