import mongoose, {Model, Schema, Document} from 'mongoose';

interface IColumn extends Document{
    title : string;
    cards : mongoose.Types.ObjectId[];
};

const ColumnSchema = new Schema<IColumn>({
    title : {
        type : String,
        required: true,
    },

    cards : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Card',
        }
    ],
}, {timestamps : true});

const Column : Model<IColumn> = mongoose.models.Column || mongoose.model('Column', ColumnSchema);

export default Column;