// Import the Mongoose library to interact with MongoDB.
import mongoose from "mongoose";
// Import dotenv to load environment variables from the .env file.
import dotenv from "dotenv";
dotenv.config();

// Get the MongoDB connection URL from environment variables.
const mongo_url = process.env.MONGODB_CONN;

// Define the asynchronous function to connect to the database.
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB instance using the URL.
        await mongoose.connect(mongo_url);
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        // If the initial connection fails, log a detailed error and exit the process.
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

// Set up a listener for Mongoose connection errors that may occur after the initial connection.
mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
    // You could add logic here to attempt to reconnect, or handle the error gracefully.
});

export default connectDB;

