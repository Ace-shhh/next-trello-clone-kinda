'use client'
import styles from './addCard.module.scss';
import { useState, useEffect, useRef } from 'react';
import { createCard } from '@/services/cardService';
import { useBoardContext } from '@/context/boardContext';
export default function AddCard({columnId, overlay} : {columnId : string, overlay : boolean | null}){
    const [addCard, setAddCard] = useState<boolean>(false)
    const [cardTitle, setCardTitle] = useState<string>('');
    const { setBoardInfo } = useBoardContext();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    //on addcard textarea focus
    useEffect(()=>{
        if(addCard && textAreaRef.current){
            const timeout = setTimeout(()=>{
                textAreaRef.current?.focus();
            }, 0);

            return () => clearTimeout(timeout);
        };


    },[addCard])

    //dynamic textarea height
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
        try{
            const newCard = await createCard({title : cardTitle, columnId});
            setBoardInfo((prev)=>{
                if(!prev) return prev;
                const updatedColumns = prev?.columns.map((col)=>{
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
            })

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
            + AddCard
            </button>
        )}
        </>
    )
}