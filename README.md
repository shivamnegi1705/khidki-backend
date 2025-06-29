# Khidki Backend

This is the backend API for the Khidki e-commerce application.

## Deploying to Vercel

### Prerequisites

1. A [Vercel](https://vercel.com/) account
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for local deployment)
3. MongoDB Atlas account (for database)
4. Cloudinary account (for image storage)

### Step 1: Set Up Environment Variables in Vercel

Before deploying, you need to set up the following environment variables in your Vercel project:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new project or select your existing project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variables (refer to `.env.example` for the complete list):

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-mongodb-uri
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://khidki-frontend.vercel.app
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-secret-key
```

If you're using Google OAuth, also add:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.vercel.app/api/user/auth/google/callback
```

If you're using payment gateways, add the respective keys:
```
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Step 2: Deploy to Vercel

#### Option 1: Deploy from the Vercel Dashboard

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your Git repository or upload your project
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: None (leave empty)
   - Output Directory: None (leave empty)
5. Click "Deploy"

#### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI if you haven't already:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Navigate to your project directory and deploy:
   ```
   cd /path/to/khidki-backend
   vercel
   ```

4. Follow the prompts to configure your project
5. For production deployment:
   ```
   vercel --prod
   ```

### Step 3: Update Frontend Configuration

After deploying your backend to Vercel, you'll get a deployment URL (e.g., `https://khidki-backend.vercel.app`).

1. Update your frontend API configuration to point to this URL:
   - In your frontend project, find where the API URL is defined
   - Replace the existing API URL with your Vercel deployment URL

2. Redeploy your frontend if necessary

### Step 4: Verify the Connection

1. Visit your frontend application at `https://khidki-frontend.vercel.app`
2. Test the functionality that requires backend API calls
3. Check the browser console for any CORS or connection errors

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Verify that your backend's CORS configuration includes your frontend domain
2. Check that the `FRONTEND_URL` environment variable is correctly set in Vercel
3. Ensure your frontend is making requests to the correct backend URL

### Database Connection Issues

If the application can't connect to MongoDB:

1. Verify your MongoDB Atlas connection string in the Vercel environment variables
2. Ensure your MongoDB Atlas cluster is accessible from Vercel's IP addresses
3. Check if your MongoDB Atlas user has the correct permissions

### Authentication Issues

If authentication is not working:

1. Verify that the `JWT_SECRET` is correctly set in Vercel
2. For Google OAuth, ensure the callback URL in your Google Cloud Console matches the one in your environment variables

## Local Development

To run the backend locally:

```
npm install
npm run server
```

The server will start on port 4000 by default.
