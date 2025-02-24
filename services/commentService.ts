import { CustomError } from "@/app/lib/definitions";

export async function createComment({comment, cardId, userId} : {comment : string, cardId : string, userId : string}){
    try{
        const response = await fetch(`/api/comment?cardId=${cardId}&userId=${userId}`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({comment : comment})
        });

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
};