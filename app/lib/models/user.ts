import mongoose, { Schema, Document, Model} from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document{
    username : string,
    email : string,
    password? : string,
    profilePicture? : string,
    ownWorkspaces : mongoose.Types.ObjectId[],
    otherWorkspaces : mongoose.Types.ObjectId[],
    googleId? : string,
    comparePassword : (candidatePassword : string) => Promise<boolean>,
};

const UserSchema = new Schema<IUser>({
    username : {
        type : String,
        required : [true, 'Username is required'],
    },
    email : {
        type : String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    password : {
        type : String,
        required: [true, 'Password is required'],
        minlength : [8, 'Password must have at least 8 characters length'],
        select : false,
        default: null,
    },
    profilePicture : {
        type: String,
    },
    ownWorkspaces : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Workspace'
    }],
    otherWorkspaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Workspace',
    }],
    googleId: {
        type : String
    },
}, {timestamps: true});

UserSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
})


UserSchema.methods.comparePassword = async function (candidatePassword: string) : Promise<boolean>{
    return bcrypt.compare(candidatePassword, this.password);
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;