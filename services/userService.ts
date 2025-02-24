import { CustomError } from "@/app/lib/definitions";

export async function fetchUsers(){
    try{    
        const response = await fetch('/api/user');

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status);
        };

        return json.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}