'use client'
import styles from './addCard.module.scss';
import { useState, useEffect, useRef } from 'react';
import { createCard } from '@/services/cardService';
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import { useWebsocketContext } from '@/context/websocketContext';

export default function AddCard({columnId, overlay} : {columnId : string, overlay : boolean | null}){
    const [addCard, setAddCard] = useState<boolean>(false)
    const [cardTitle, setCardTitle] = useState<string>('');
    const { setBoardInfo } = useBoardDispatch();
    const { boardInfo } = useBoardState();
    const { socketId } = useWebsocketContext();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(()=>{
        if(addCard && textAreaRef.current){
            const timeout = setTimeout(()=>{
                textAreaRef.current?.focus();
            }, 0);

            return () => clearTimeout(timeout);
        };


    },[addCard])

    function handleInput(){
        if (textAreaRef.current){
            textAreaRef.current.style.height = 'auto';
            const scrollHeight = textAreaRef.current.scrollHeight;

            if(scrollHeight <= 150){
                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
                textAreaRef.current.style.overflowY = 'hidden';
            }
            else{
                textAreaRef.current.style.height = '150px';
                textAreaRef.current.style.overflowY= 'auto'
            }
        }
    }

    //create new card
    async function handleClick(){
        const trim = cardTitle.trim();
        if(!socketId || !trim || !boardInfo) return;

        try{
            const newCard = await createCard({title : cardTitle, columnId, boardId : boardInfo._id, socketId});
            setBoardInfo((prev)=>{
                if(!prev) return prev;
                const updatedColumns = prev.columns.map((col)=>{
                    if(col._id === columnId){
                        return {
                            ...col,
                            cards : [...col.cards, newCard]
                        }
                    }
                    return col;
                })
                return {
                    ...prev,
                    columns : updatedColumns
                }
            });

            setAddCard(false);
            setCardTitle('');
        }
        catch(error){
            alert(error)
        }
    }

    return(
        <>
        {addCard? (
            <div>
                <textarea 
                    className={styles.textarea} 
                    ref={textAreaRef} value={cardTitle} 
                    onChange={(e)=>setCardTitle(e.target.value)} 
                    onInput={handleInput}
                    placeholder='Enter title'
                />
                <button className={styles.addCard} onClick={handleClick}>Add card</button>
                <button className={styles.cancelAddCard}onClick={()=> setAddCard(false)}>X</button>
            </div>
        ) : 
        (
            <button className={`${styles.button} ${overlay? styles.overlay : null}`} onClick={()=> setAddCard(true)}>
            + Add a card
            </button>
        )}
        </>
    )
}