import { CustomError } from "@/app/lib/definitions";

interface createCommentType{
    comment : string
    cardId : string
    userId : string
    socketId : string
}

export async function createComment(prop : createCommentType){
    try{
        const response = await fetch(`/api/comment`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify(prop)
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