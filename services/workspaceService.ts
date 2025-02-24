import { CustomError } from "@/app/lib/definitions";
type createWorkspaceParams = {
    name : string,
    description : string,
    userId : string
};

export async function createWorkspace({name, description, userId} : createWorkspaceParams){
    try{
        const response = await fetch('/api/workspace',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({name, description, userId})
        });

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.message, response.status);
        }

        return json.data;
    }
    catch(error : unknown){
        console.log(error)
        throw error;
    };
};

export async function addWorkspaceMembers(workspaceId : string, newMembers : string[]){
    try{
        const response = await fetch (`/api/workspace/update?workspaceId=${workspaceId}`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({data : newMembers})
        });

        const json = await response.json();

        if(!response.ok){
            throw new CustomError(json.error, response.status)
        }

        return json.data;
    }
    catch(error : unknown){
        console.log(error);
        throw error;
    }
}