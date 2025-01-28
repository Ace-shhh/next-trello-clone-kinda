import mongoose,{Schema, Model, Document} from 'mongoose';

interface IBoard extends Document{
    title : string;
    columns : mongoose.Types.ObjectId[];
};

const BoardSchema = new Schema<IBoard>({
    title : {
        type: String,
        required : true
    },
    columns : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    }]
})


const Board : Model<IBoard> = mongoose.models.Board || mongoose.model('Board', BoardSchema);

export default Board;