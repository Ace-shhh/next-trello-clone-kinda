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
    catch(error : any){
        console.log(error);
        throw new Error(error.message)
    }
}