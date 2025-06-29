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
        // Don't throw the error in serverless environment to prevent function crash
        if (process.env.NODE_ENV !== 'production') {
            throw error;
        }
    }
}

export default connectDB;
