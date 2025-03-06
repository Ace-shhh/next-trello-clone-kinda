import { CustomError, IColumn } from "@/app/lib/definitions";

type createBoardParams = {
    title : string;
    description : string;
    workspaceId : string;
}

export async function createBoard({title, description, workspaceId} : createBoardParams){
    try{
        const response = await fetch(`/api/board/`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({title, description, workspaceId})
        })

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.message, response.status);
        }

        return json.data;
    }
    catch(error : unknown){
        console.log(error);
        throw error;
    }
}

export async function getBoard({boardId, wsId} : {boardId : string, wsId : string}){
    try{
        const response = await fetch(`/api/board?id=${boardId}&wsId=${wsId}`,{
            method : 'GET',
            headers : {'Content-Type' : 'application/json'}
        });

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status)
        };

        return(json.data)
    }
    catch(error : any){
        console.log(error)
        throw error;
    }
}

export async function udpateColumnOrder(id : string, columns : IColumn[]){
    const columnIds = columns.map(col => col._id);

    try{
        const response = await fetch(`/api/board?id=${id}`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(columnIds),
        })

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status)
        }

        return json;
    }
    catch(error){
        console.log(error)
        throw error;
    }
}