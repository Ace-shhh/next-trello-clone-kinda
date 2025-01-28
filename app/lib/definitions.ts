export type IWorkspace = {
    _id : string;
    name : string;
    description : string;
    members : Member[];
    boards : IBoard[];
}

export type User = {
    _id : string,
    username : string,
    email : string,
    ownWorkspaces : IWorkspace[],
    otherWorkspaces : IWorkspace[],
}

export type IBoard = {
    _id: string;
    title : string;
    columns : IColumn[];
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
    comments : string;
    webhookEvents : string;
    watchers : User[];
}