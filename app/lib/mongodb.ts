import mongoose from 'mongoose';
const uri = process.env.MONGO_URI as string;

if(!uri){
    throw new Error('Mongodb uri is not defined. Please check you env file');
};

let cached = (global as any).mongooseConnection;

const connectToDatabase = async()=>{
    try{
        if(!cached){
            cached = await mongoose.connect(uri, {
                maxPoolSize: 10,
            })
            console.log('new database connection established')
        }
        await cached;
    }
    catch(error : unknown){
        console.log('Connection to database failed', error);
        throw new Error('Failed to connect to mongodb');
    };
};


export default connectToDatabase;