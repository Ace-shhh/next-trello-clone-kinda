import mongoose,{Schema, Model, Document} from 'mongoose';

interface IWebhookEvent extends Document{
    title : string;
    githubRequestId : string;
    githubLink : string;
    author : string;
    state : string;
}


const WebhookEventSchema = new Schema<IWebhookEvent>({
    title : {
        type : String,
        required : true,
        trim : true,
    },
    githubRequestId : {
        type : String,
        required : true,
    },
    githubLink : {
        type : String,
        required : true,
    },
    author : {
        type : String,
        required : true,
        trim : true,
    },
    state : {
        type : String,
        required : true,
    },

}, {timestamps : true});

const WebhookEvent : Model<IWebhookEvent> = mongoose.models.WebhookEvent || mongoose.model("WebhookEvent", WebhookEventSchema);

export default WebhookEvent;