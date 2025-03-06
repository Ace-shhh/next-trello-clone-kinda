'use client'
import styles from './addColumn.module.scss';
import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { createColumn } from '@/services/columnService';
import { useBoardContext } from '@/context/boardContext';

export default function AddColumn({boardId} : {boardId : string}){
    const [addColumn, setAddColumn] = useState<boolean>(false);
    const [newColumnTitle, setNewColumnTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setBoardInfo } = useBoardContext();
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(()=>{
        if(addColumn && inputRef.current){
            inputRef.current.focus();
        }
    },[addColumn])

    const handleClick = async() =>{
        setIsLoading(true);
        try{
            const result = await createColumn({title : newColumnTitle, boardId});

            setBoardInfo((prev)=> {
                if (!prev) return prev;
                return {
                    ...prev,
                    columns : [...prev.columns, result]
                }
            });

            setNewColumnTitle('');
            setAddColumn(false);
        }
        catch(error : unknown){
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
        finally{
            setIsLoading(false);
        }
    }

    return(
        <div className={clsx(styles.container, {[styles.active] : addColumn})} style={{ backgroundColor : addColumn? 'white' : ''}} onClick={()=>setAddColumn(!addColumn)}>
            {addColumn ? (
                <div onClick={(e)=> e.stopPropagation()}>
                    <input type='text' ref={inputRef} value={newColumnTitle} onChange={(e)=>setNewColumnTitle(e.target.value)}/>
                    <button onClick={handleClick} disabled={isLoading}>Add List</button>
                    <button onClick={()=>setAddColumn(false)}>X</button>
                </div>
            ) : 
            (
                <p>+ Add Another List</p>
            )}
        </div>
    )
};