import mongoose, { Schema, Model } from 'mongoose';

interface IComment{
    comment : string;
    user : mongoose.Types.ObjectId;
    createdAt : Date;
    updatedAt : Date;
}

const CommentSchema = new Schema<IComment>({
    comment : {
        type : String,
        required : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
},{ timestamps : true });


const Comment : Model<IComment> = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment;