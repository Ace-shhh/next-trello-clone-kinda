'use client'
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { useEffect } from 'react'
import AddColumn from '@/app/components/board/addColumn';
import Column from '@/app/components/column/column';
import { useBoardContext } from '@/context/boardContext';
import DragAndDropProvider from '@/app/components/dragAndDrop/DragAndDropProvider';
export default function Board(){
    const {boardInfo, setBoardInfo} = useBoardContext();
    const params = useParams();
    const { id } = params;

    useEffect(()=>{
        console.log(id)
        async function fetchBoardInfo(){
            const response = await fetch('/api/board', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({id})
            });
            
            if(!response.ok){
                const json = await response.json();
                console.log(json.error);
                alert(json.error);
            };

            const json = await response.json();
            console.log(json.data)
            setBoardInfo(json.data);
        }

        fetchBoardInfo();
    },[])

    if(!boardInfo){
        return <div>Loading...</div>
    }


    return(
        <div className={styles.container}>
            <div className={styles.boardInformation}>
                <h2>{boardInfo.title}</h2>
            </div>
            <div className={styles.cardsContainer}>
                <DragAndDropProvider items={boardInfo.columns.map(col => col._id)}>
                    {boardInfo.columns.map((col)=>
                    <Column key={col._id} data={col}/>)}
                </DragAndDropProvider>
                <AddColumn boardId={boardInfo._id}/>
            </div>
        </div>
    )   
}