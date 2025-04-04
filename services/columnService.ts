import { IColumn, IColumnUpdate } from "@/app/lib/definitions";

export async function createColumn({title, boardId, socketId} : {title : string, boardId : string, socketId : string}){
    try{  
        const response = await fetch('/api/column/create', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({title, boardId, socketId})
        })

        const json = await response.json();
        
        if(!response.ok){
            throw new Error(json.message || 'Failed to create column');
        };
        
        return json.data;
    }
    catch(error : any){
        console.log(error);
        throw new Error(error.message || 'Something went wrong');
    }
}

export async function EditColumnTitle(id : string, data : IColumnUpdate){
    
    try{
        const response = await fetch(`/api/column/update/${id}`, {
            method : 'PATCH',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(data)
        })

        const json = await response.json();

        if(!response.ok){
            throw new Error(json.error)
        }

        return json;
    }
    catch(error: any){
        console.log(error);
        throw new Error(error)
    }
}

export async function updateColumnCardsOrder(columnIds : string[], columns : IColumn[]){
    const columnUpdatePromises = columnIds.map((col)=>{
        
        const columnInfo = columns.find(column=> column._id === col);
        
        const columnCards = columnInfo?.cards.map(card=> card._id);
        return fetch(`/api/column/update/${col}`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(columnCards),
        }).then(response => {
            if(!response.ok){
                return Promise.reject(`Failed to update columnId : ${col}`)
            }
            return response.json();
        })
    })

    try{
        const results = await Promise.all(columnUpdatePromises);
        return results;
    }
    catch(error){
        console.log(error)
        throw error;
    }
}