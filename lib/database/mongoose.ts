import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// too many mongodb connections open on each every action on the serverside  without optimization
let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
  cached = (global as any).mongoose = {
    conn: null, promise: null 
  }
}

export const connectToDatabase = async () => {
  //if we do have it so exit out inmediately 
  if(cached.conn) cached.conn

  if(!MONGODB_URL) throw new Error('Missing MONGODB_URL')

  cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
    dbName: 'imaginify',
    bufferCommands: false
  })

  cached.conn = await cached.promise;

  return cached.conn
}