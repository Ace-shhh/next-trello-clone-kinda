import styles from './cardTitleEditor.module.scss'
import { useRef, useEffect, useState } from 'react';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import { updateCardTitle } from '@/services/cardService';
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import { IoCardOutline } from "react-icons/io5";

export default function CardTitleEditor(){
    const { selectedColumn, cardInfo } = useBoardState();
    const { setBoardInfo } = useBoardDispatch();
    const [newTitle, setNewTitle] = useState<string>(cardInfo? cardInfo.title : 'null');
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const cancelUpdateRef = useRef<boolean>(false);

    if(!cardInfo) return <div>Loading...</div>

    useEffect(()=>{
        if(textAreaRef.current){
            autoResize();
        }
    },[newTitle])

    useEffect(()=>{

        function escapeListener(e : KeyboardEvent){
            if(!cardInfo) return;
        
            if(e.key === 'Escape'){
                cancelUpdateRef.current = true;
                setNewTitle(cardInfo.title);
                textAreaRef.current?.blur();
            };
        };

        document.addEventListener('keydown', escapeListener);

        return () =>{
            document.removeEventListener('keydown', escapeListener);
        };
    },[]);

    async function handleBlur(){
        if(!cardInfo) return;
        if(cancelUpdateRef.current){
            cancelUpdateRef.current = false;
            return;
        }

        const titleTrim = newTitle.trim();
        if(!newTitle || titleTrim === cardInfo.title) return;
        try{
            const updatedCard = await updateCardTitle({id : cardInfo._id, title : titleTrim})
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const updatedColumns = prev.columns.map(col=>{
                    if(col._id === selectedColumn?._id){
                        const updatedCards = col.cards.map(card=>
                            card._id === cardInfo._id ? updatedCard : card
                        );
                        return {...col, cards : updatedCards}
                    }
                    return col;
                })
                return {...prev, columns : updatedColumns};
            })
        }
        catch(error){
            if(error instanceof CustomError){
                toast.error(error.message)
            }
            else{
                toast.error(String(error))
            }
        }
    }

    function autoResize(){
        if(textAreaRef.current){
            textAreaRef.current.style.height = "25px";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = `${Math.max(scrollHeight, 25)}px`
        }
    }
    
    return(
        <div className={styles.container}>
            <IoCardOutline className={styles.icon} size={25}/>
            <textarea value={newTitle} 
                onChange={(e)=>setNewTitle(e.target.value)} 
                className={styles.textarea} 
                ref={textAreaRef}
                onBlur={handleBlur}
            />
            <span className={styles.ticketNumber}>#{cardInfo.ticketNumber}</span>
            <span className={styles.listName}>in list {selectedColumn?.title}</span>
        </div>
    )
}   