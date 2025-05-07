import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connect to MongoDB database
 * @returns Mongoose connection
 * @throws Error if connection fails
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spirits-vault';
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
}; 