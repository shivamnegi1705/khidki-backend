import {v2 as cloudinary } from "cloudinary"

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
        
        // Verify connection if in development mode
        if (process.env.NODE_ENV !== 'production') {
            // Simple ping to verify credentials
            await cloudinary.api.ping();
            console.log("Cloudinary connected");
        }
    } catch (error) {
        console.error("Failed to connect to Cloudinary:", error);
        // Don't throw the error in serverless environment to prevent function crash
        if (process.env.NODE_ENV !== 'production') {
            throw error;
        }
    }
}

export default connectCloudinary;
