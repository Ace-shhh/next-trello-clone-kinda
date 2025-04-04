import mongoose, {Model, Document, Schema} from 'mongoose';

interface ICard extends Document{
    _id : string;
    title : string;
    description : string;
    watchers : mongoose.Types.ObjectId[];
    comments : mongoose.Types.ObjectId[];
    ticketNumber : Number;
    webhookEvents : mongoose.Types.ObjectId[];
    activity : mongoose.Types.ObjectId[];
}

const CardSchema = new Schema<ICard>({
    title : {
        type : String,
        required: true
    },
    description : {
        type : String,
    },
    watchers : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }],
    ticketNumber : {
        type : Number,
        required : true,
    },
    webhookEvents : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'WebhookEvent'
    }],
    activity : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Activity'
    }]

}, {timestamps : true});

const Card : Model<ICard> = mongoose.models.Card || mongoose.model('Card', CardSchema);

export default Card;