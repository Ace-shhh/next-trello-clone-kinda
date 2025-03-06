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

export async function updateUser(id : string, formData : FormData){
    try{
        const response = await fetch(`/api/user/update?id=${id}`,{
            method : 'POST',
            body : formData,
        });
        
        const json = await response.json();
        
        if(!response.ok){
            throw new CustomError(json.error, response.status);
        }

        return json.data;
    }
    catch(error : unknown){
        console.log(error);
        throw error;
    }
}