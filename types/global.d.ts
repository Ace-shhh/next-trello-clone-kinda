import mongoose from 'mongoose';

declare global {
  var mongooseConnection: typeof mongoose | null;
}

export {};