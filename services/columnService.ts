import { IColumnUpdate } from "@/app/lib/definitions";
export async function createColumn({title, boardId} : {title : string, boardId : string}){
    try{  
        const response = await fetch('/api/column/create', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({title : title, boardId : boardId})
        })

        const json = await response.json();
        
        if(!response.ok){
            throw new Error(json.error || 'Failed to create column');
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