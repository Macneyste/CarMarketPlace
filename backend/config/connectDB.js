import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'car-marketplace';

async function connectDB() {
  const connection = await mongoose.connect(MONGO_URI, {
    dbName: MONGO_DB_NAME,
  });

  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`,
  );
}

export default connectDB;

