import mongoose, {Schema, Document, Model} from 'mongoose'

interface ICount extends Document{
    name : string;
    count : number;
}

const CountSchema = new Schema<ICount>({
    name : {
        type : String,
        required : true,
    },
    count : {
        type : Number,
        required : true,
    }
})

const Count : Model<ICount> = mongoose.models.Count || mongoose.model('Count', CountSchema);

export default Count;