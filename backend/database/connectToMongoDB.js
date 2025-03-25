import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const DB_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/reddit-clone';

const connectToMongoDB = async() => {
   try {
    const connection = await mongoose.connect(DB_URL);
    console.log(`Connected to ${connection.connection.host}`);
   } catch (e) {
    console.log(`Error connection ${e.message}`);
   }
}

export default connectToMongoDB;