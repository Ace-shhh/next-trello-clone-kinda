'use client'
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { useEffect } from 'react'
import AddColumn from '@/app/components/board/addColumn';
import Column from '@/app/components/column/column';
import { useBoardContext } from '@/context/boardContext';
import DragAndDropProvider from '@/app/components/dragAndDrop/DragAndDropProvider';
import { toast } from 'react-toastify';
import { CustomError } from '@/app/lib/definitions';
import { getBoard } from '@/services/boardService';
import CardDetails from '@/app/components/card/cardDetails/cardDetails';

export default function Board(){
    const {boardInfo, setBoardInfo, selectedCardId} = useBoardContext();
    const params = useParams();
    const { id } = params;

    useEffect(()=>{
        async function fetchBoardInfo(){
            try{
                const result = await getBoard({boardId : id as string});

                if(!result){
                    throw new CustomError('Something went wrong. Please try again later.')
                }

                setBoardInfo(result);
            }
            catch(error : unknown){
                if(error instanceof CustomError){
                    toast.error(error.message, {autoClose : 5000})
                }else{
                    toast.error('Unexpected error occured please try again later.', {autoClose : 5000})
                }
            }
        }

        fetchBoardInfo();
    },[id, setBoardInfo])

    if(!boardInfo){
        return <div>Loading...</div>
    }


    return(
        <div className={styles.container}>
            <div className={styles.boardInformation}>
                <h2>{boardInfo.title}</h2>
            </div>
            <div className={styles.cardsContainer}>
                <DragAndDropProvider items={boardInfo.columns.map(col => `column-${col._id}`)}>
                    {boardInfo.columns.map((col)=>
                    <Column key={col._id} data={col} overlay={null}/>)}
                </DragAndDropProvider>
                <AddColumn boardId={boardInfo._id}/>
            </div>
            {selectedCardId && <CardDetails id={selectedCardId}/>}
        </div>
    )   
}