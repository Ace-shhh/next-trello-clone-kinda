import { useEffect } from 'react';

export function useKeyPress(targetKey : string, callback : (event : KeyboardEvent) => void){
    useEffect(()=>{
        const handleKeyDown = (event : KeyboardEvent) =>{
            if(event.key === targetKey){
                callback(event);
            };
        };
        document.addEventListener('keydown', handleKeyDown);
        return ()=>{
            document.removeEventListener('keydown', handleKeyDown);
        };
    },[targetKey, callback])
};