import mongoose, { Schema, Model, Document } from "mongoose";

interface IActivity extends Document{
    action : string;
    entity : mongoose.Types.ObjectId;
    from : string | mongoose.Types.ObjectId | null;
    to : string | mongoose.Types.ObjectId | null;
    in : string | mongoose.Types.ObjectId;
    user : mongoose.Types.ObjectId;
    metadata : Record<string, any>
}

const ActivitySchema = new Schema<IActivity>({
    action : {
        type : String,
        required : true,
    },
    entity : {
        type : mongoose.Schema.Types.ObjectId,
        refPath : "entityType",
    },
    from : {
        type : String,
    },
    to : {
        type : String,
    },
    in : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "entityType"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', 
    },
    metadata : {
        type : Schema.Types.Mixed,
        default : {},
    }
}, {timestamps : true});

const Activity : Model<IActivity> = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

export default Activity;