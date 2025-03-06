import mongoose from 'mongoose';
process.env.ESLINT_NO_PATCH = 'true';
declare module 'eslint-config-next';
declare global {
  var mongooseConnection: typeof mongoose | null;
}

export {};