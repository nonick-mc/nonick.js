import mongoose from 'mongoose';

export async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.DATABASE_URL, {
    dbName: process.env.DATABASE_NAME,
  });
}
