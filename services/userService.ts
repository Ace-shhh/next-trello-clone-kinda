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

export async function createUser({username, email, password} : {username : string, email : string, password : string}){

    try{
        const response = await fetch('/api/user/register',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({username, email, password})
        });
        const json = await response.json();
        if(!response.ok){
            throw new CustomError('Failed to create new user. Please try again.', response.status);
        }

        return json.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}