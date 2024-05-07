import mongoose from 'mongoose';

/**
 * Connect to the database. Throws an error if the necessary environment
 * variables are not set.
 *
 * @returns A promise that resolves to the mongoose instance.
 */
function connect(): Promise<typeof mongoose> {
  if (typeof process.env.DATABASE_CONNECTION_STRING !== 'string') {
    throw new Error('DATABASE_CONNECTION_STRING is not set');
  }

  return mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
}

const DatabaseService = { connect };
export default DatabaseService;
