import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        if (!MONGO_URL) {
            throw new Error("Connection string is invalid");
        };
        await mongoose.connect(MONGO_URL);
        console.log('Connect database success');
    }
    catch (error) {
        console.error('Connect database error"', error);
        process.exit(1);
    }
};