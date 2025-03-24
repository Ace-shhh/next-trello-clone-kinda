import { IActivity } from "./definitions";
import { Activity } from "./models";
import connectToDatabase from "./mongodb";

export default async function ActivityLogger(data : IActivity){
    await connectToDatabase();

    try{
        const newActivity = new Activity(data);

        const savedComment = await newActivity.save();

        if(!savedComment) return 'Failed';

        return newActivity._id;
    }
    catch(error){
        console.log(`Error activity logging for ${data.entity}`);
        return null;
    };
};