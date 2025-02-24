import { CustomError } from "@/app/lib/definitions";

export async function createCard({title, columnId} : {title : string, columnId : string}){
    try{
        const response = await fetch('/api/card', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({title, columnId})
        })

        const json = await response.json();

        if(!response.ok){
            throw new Error('Failed to create new card', json.error);
        }

        return json.data;
    }
    catch(error : unknown){
        console.log(error);
        throw error;
    }
}

export async function fetchCardInfo(id : string){
    try{
        const response = await fetch(`/api/card?id=${id}`);

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status);
        };

        return json.data;
    }
    catch(error : unknown){
        console.log(error);
        throw error
    }
}

export async function updateCardTitle({id, title} : {id : string, title : string}){
    try{
        const response = await fetch(`/api/card/update?id=${id}`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({title : title})
        })

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status);
        };

        return json.data;
    }
    catch(error : unknown){
        console.log(error);
        throw error;
    }
}

export async function updateCardDescription({id, description} : {id : string, description : string}){
    try{
        const response = await fetch(`/api/card/update?id=${id}`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({description : description})
        })

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status);
        };

        return json.data;
    }
    catch(error){
        console.log(error);
        throw error;
    };
}

export async function updateCardNotification({id, watchers} : {id : string, watchers : string[]}){
    try{
        const response = await fetch(`/api/card/update?id=${id}`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({watchers : watchers})
        })

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status);
        };

        return json.data;
    }
    catch(error){
        console.log(error)
        throw error;
    }
}