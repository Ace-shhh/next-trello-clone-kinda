import mongoose, {Model, Document, Schema} from 'mongoose';

interface ICard extends Document{
    _id : string;
    title : string;
    description : string;
}

const CardSchema = new Schema<ICard>({
    title : {
        type : String,
        required: true
    },
    description : {
        type : String,
    },

}, {timestamps : true});

const Card : Model<ICard> = mongoose.models.Card || mongoose.model('Card', CardSchema);

export default Card;