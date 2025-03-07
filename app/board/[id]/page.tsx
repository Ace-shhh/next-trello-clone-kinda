'use client'
import styles from './page.module.scss';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react'
import AddColumn from '@/app/components/board/addColumn';
import Column from '@/app/components/column/column';
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import DragAndDropProvider from '@/app/components/dragAndDrop/DragAndDropProvider';
import { toast } from 'react-toastify';
import { CustomError } from '@/app/lib/definitions';
import { getBoard } from '@/services/boardService';
import CardDetails from '@/app/components/card/cardDetails/cardDetails';
import BoardMenu from '@/app/components/board/boardMenu/boardMenu';

export default function Board(){
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const { setBoardInfo } = useBoardDispatch();
    const { boardInfo, selectedCardId } = useBoardState();
    const params = useParams();
    const searchParams = useSearchParams();
    const { id } = params;
    const role = searchParams.get('role');
    const wsId = searchParams.get('wsId') ?? '';

    useEffect(()=>{
        async function fetchBoardInfo(){
            try{
                const result = await getBoard({boardId : id as string, wsId : wsId});
                if(!result){
                    throw new CustomError('Something went wrong. Please try again later.')
                };
                setBoardInfo(result);
            }
            catch(error : unknown){
                if(error instanceof CustomError){
                    toast.error(error.message, {autoClose : 5000});
                }else{
                    toast.error('Unexpected error occured please try again later.', {autoClose : 5000});
                };
            };
        };
        fetchBoardInfo();
    },[id, setBoardInfo]);

    const handleClose = useCallback(()=>{
        setShowMenu(false)
    }, [])

    if(!boardInfo){
        return <div>Loading...</div>
    }



    return(
        <div className={styles.container}>
            <div className={`${styles.boardContent}`}>
                <div className={styles.boardInformation}>
                    <h2>{boardInfo.title}</h2>
                    <button onClick={()=>setShowMenu(!showMenu)}>...</button>
                </div>
                <div className={styles.cardsContainer}>
                    <DragAndDropProvider items={boardInfo.columns.map(col => `column-${col._id}`)}>
                        {boardInfo.columns.map((col)=>
                        <Column key={col._id} data={col} overlay={null}/>)}
                    </DragAndDropProvider>
                    <AddColumn boardId={id as string}/>
                </div>
            </div>
            <div className={`${styles.boardMenu} ${showMenu? styles.grow : ''}`}>
                <BoardMenu onClose={handleClose}/>
            </div> 
            {selectedCardId && <CardDetails id={selectedCardId}/>}
        </div>
    )   
}