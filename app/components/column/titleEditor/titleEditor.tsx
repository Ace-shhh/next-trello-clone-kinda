'use client'
import styles from './titleEditor.module.scss';
import { useState, useEffect, useRef } from 'react';
import { EditColumnTitle } from '@/services/columnService';
import { useBoardDispatch } from '@/context/boardContext';
export default function TitleEditor({columnId, title} : {columnId : string, title : string}){
    const [currentTitle, setCurrentTitle] = useState<string>(title);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { setBoardInfo } = useBoardDispatch();
    
    useEffect(()=>{
        autoResize();
    },[currentTitle])

    function handleInput(){
        autoResize();
    };

 
   function autoResize(){
        if(textAreaRef.current){
            textAreaRef.current.style.height = "auto";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = `${scrollHeight}px`
        }
    }

    function handleKeyDown(e : React.KeyboardEvent<HTMLTextAreaElement>){
        if(e.key === 'Enter'){
            e.preventDefault();
            textAreaRef.current?.blur();
        }
        if(e.key === 'Escape'){
            setCurrentTitle(title);
            setIsFocused(false);
            textAreaRef.current?.blur();
        };
    }

    async function handleBlur(){
        const trim = currentTitle.trim();
        if(!trim){
            setCurrentTitle(title);
            setIsFocused(false);
            return;
        }
        if(trim === title){
            setIsFocused(false);
            return;
        };

        try{
            setIsLoading(true);

            const result = await EditColumnTitle(columnId, {title : currentTitle})
            
            setBoardInfo((prev)=>{
                if(!prev) return prev;

                const updatedColumns = prev.columns.map((col)=>{
                    if(col._id === columnId){
                        return {...col, title : result.title};
                    }

                    return col;
                })

                return {...prev, columns : updatedColumns}
            });
        }
        catch(error){
            console.log(error);
            alert(error);
            setCurrentTitle(title);
            setIsError(true);
        }
        finally{
            setIsLoading(false);
            setIsFocused(false)
        }
    }
    
    return(
        <div>
            <textarea 
                className={`${styles.titleEditor} ${isError ? styles.error : ''}`} 
                ref={textAreaRef} 
                value={currentTitle} 
                onChange={(e)=> setCurrentTitle(e.target.value)}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                rows = {1}
                onBlur={handleBlur}
                disabled={isLoading || isError}
                onClick={()=>textAreaRef.current?.select()}
                onFocus={()=> setIsFocused(true)}
            />
            {isFocused? (<p className={styles.cancel}>Press escape to cancel changes</p>) : ('')}
        </div>

    )
}