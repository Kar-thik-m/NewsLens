import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Connect_to_db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default Connect_to_db;