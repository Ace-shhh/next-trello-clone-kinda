export type IWorkspace = {
    _id : string;
    name : string;
    description : string;
    members : Member[];
    boards : IBoard[];
    color : Color;
}

export type Color = {
    hue : number;
    saturation : number;
    lightness : number;
}

export type User = {
    _id : string,
    username : string,
    email : string,
    ownWorkspaces : IWorkspace[],
    otherWorkspaces : IWorkspace[],
    profilePicture : string,
}

export type IBoard = {
    _id: string;
    title : string;
    columns : IColumn[];
    archive : IColumn[];
}

export type Member = {
    userId : string;
    role : string;
    _id : string;
}

export type IColumn = {
    _id: string;
    title : string;
    cards : ICard[];
}

export type IColumnUpdate = Partial<Omit<IColumn, "_id">>

export type ICard = {
    _id : string;
    title : string;
    description : string;
    ticketNumber : number;
    comments : IComment[];
    webhookEvents : IWebhook[];
    watchers : string[];
}

export type IWebhook = {
    _id : string;
    title : string;
    githubRequestId : string;
    githubLink : string;
    author : string;
    state : string;
}

export type IComment = {
    _id : string
    comment : string;
    user : User;
    createdAt : Date;
    updatedAt : Date;
}

export class CustomError extends Error {
    status? : number;

    constructor(message : string, status? : number){
        super(message);
        this.status = status;
        if(Error.captureStackTrace){
            Error.captureStackTrace(this, CustomError)
        }
    }
}