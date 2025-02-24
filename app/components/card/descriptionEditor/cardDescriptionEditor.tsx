import styles from './cardDescriptionEditor.module.scss';
import { useState, useRef, useEffect } from 'react';
import { updateCardDescription } from '@/services/cardService';
import { useBoardContext } from '@/context/boardContext';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
export default function CardDescriptionEditor(){
    const { cardInfo, setCardInfo } = useBoardContext();
    if(!cardInfo) return <div>Loading...</div>

    const [edit, setEdit] = useState<boolean>(false);
    const [newDescription, setNewDescription] = useState<string | undefined>(cardInfo.description || undefined);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);


    useEffect(()=>{
        if(edit){
            textAreaRef.current?.focus()
        }
    },[edit])

    useEffect(()=>{
        function escapeListener(e : KeyboardEvent){
            if(e.key === 'Escape'){
                setEdit(false);
            };
        };

        document.addEventListener('keydown', escapeListener);
        
        return ()=>{
            document.removeEventListener('keydown', escapeListener);
        };
    },[]);

    function handleClick(){
        setEdit(true);
    };

    async function handleSave(){
        if(!cardInfo) return;
        const descriptionTrim = newDescription?.trim();
        if(!descriptionTrim || descriptionTrim === cardInfo.description) return;
        
        try{
            const updatedCard = await updateCardDescription({id : cardInfo._id, description : descriptionTrim});
            setCardInfo(prev=>{
                if(!prev) return prev;
                return {...prev, description : updatedCard.description}
            })
        }
        catch(error : unknown){
            if(error instanceof CustomError){
                toast.error(error.message);
            }
            else{
                toast.error(String(error))
            }
        }
        finally{
            setEdit(false);
        };
    };

    return(
        <div className={styles.container}>
            <span>Description</span>
            {edit ? (
                <div className={styles.editor}>
                    <textarea ref={textAreaRef} value={newDescription} onChange={(e)=> setNewDescription(e.target.value)}/>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={()=> setEdit(false)}>Cancel</button>
                </div>
            ) : (
                <button className={styles.descriptionButton} onClick={handleClick}>{cardInfo.description? cardInfo.description : 'Add a more detailed description'}</button>
            )}
        </div>
    )
}