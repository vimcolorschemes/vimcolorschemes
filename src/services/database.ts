import mongoose, { Mongoose } from 'mongoose';

declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

const CONNECTION_STRING: string = process.env.DATABASE_CONNECTION_STRING!;
if (!CONNECTION_STRING) {
  throw new Error(
    'Please define the DATABASE_CONNECTION_STRING environment variable.',
  );
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to the database.
 * @returns A promise that resolves to the mongoose instance.
 */
async function connect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(CONNECTION_STRING, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

const DatabaseService = { connect };
export default DatabaseService;
