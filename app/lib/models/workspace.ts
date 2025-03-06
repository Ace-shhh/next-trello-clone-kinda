import mongoose, {Schema, Model} from 'mongoose';

interface IWorkspace{
    name : string;
    description?: string;
    members: Member[];
    boards : mongoose.Types.ObjectId[];
}

interface Member{
    userId : mongoose.Types.ObjectId;
    role : string;
}

const WorkspaceSchema = new Schema<IWorkspace>({
    name: {
        type : String,
        required : true
    },
    description: {
        type: String
    },
    members : [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role : {
            type : String,
            enum : ['admin', 'member', 'guest', 'owner']
        }
    }],
    boards : [{
        type : mongoose.Schema.ObjectId,
        ref : 'Board'
    }]
}, {timestamps : true})


const Workspace : Model<IWorkspace> = mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema);

export default Workspace