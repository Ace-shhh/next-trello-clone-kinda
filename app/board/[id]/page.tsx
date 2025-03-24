'use client'
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import { toast } from 'react-toastify';
import { CustomError, ICard, IColumn } from '@/app/lib/definitions';
import { getBoard } from '@/services/boardService';

import AddColumn from '@/app/components/board/addColumn';
import Column from '@/app/components/column/column';
import DragAndDropProvider from '@/app/components/dragAndDrop/DragAndDropProvider';
import CardDetails from '@/app/components/card/cardDetails/cardDetails';
import BoardMenu from '@/app/components/board/boardMenu/boardMenu';
import Overlay from '@/app/components/overlay/Overlay';
import CustomSpinner from '@/app/components/loading/CustomSpinner/customSpinner';
import useBoardSubscription from '@/app/hooks/useBoardSubscription';

interface ListActionsType{
    action : string;
    data : IColumn;
}

interface CardActionsType{
    action : string;
    columnId? : string;
    data : ICard;
}

export default function Board() {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const { setBoardInfo } = useBoardDispatch();
    const { boardInfo, selectedCardId } = useBoardState();

    const params = useParams();
    const searchParams = useSearchParams();
    const { id } = params;
    const boardId = id as string;
    const wsId = searchParams.get('wsId') ?? '';
    const router = useRouter();

    const ListHandler = useCallback((event : ListActionsType) : void =>{
        if(event.action === 'create'){
            setBoardInfo(prev=>{
                if(!prev) return prev;
                return {...prev, columns : [...prev.columns, event.data]};
            });
        }
        else if(event.action === 'archive'){
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const columnId = event.data._id;
                const savedColumn = prev.columns.find(col=> col._id === columnId);
                if(!savedColumn) return prev;
                return {...prev, columns : prev.columns.filter(col=> col._id !== columnId), archive : [...prev.archive, savedColumn]}
            });
        }
        else if(event.action === 'unarchive'){
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const columnId = event.data._id;
                const savedColumn = prev.archive.find(col=> col._id === columnId);
                if(!savedColumn) return prev;
                return {...prev, columns : [...prev.columns, savedColumn], archive : prev.archive.filter(col=> col._id !== columnId)}
            });
        }
    },[]);

    const CardHandler = useCallback((event : CardActionsType)=>{
        if(event.action === 'create'){
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const updatedColumns = prev.columns.map(col=>{
                    if(col._id === event.columnId){
                        return {...col, cards : [...col.cards, event.data]}
                    }
                    return col;
                })
                return {...prev, columns : updatedColumns}
            })
        }
    },[])

    useBoardSubscription(id as string, ListHandler, CardHandler);

    useEffect(() => {
        async function fetchBoardInfo() {
            try {
                const result = await getBoard({ boardId, wsId: wsId });
                if (!result) {
                    throw new CustomError('Something went wrong. Please try again later.');
                }
                setBoardInfo(result);
            } catch (error: unknown) {
                if (error instanceof CustomError) {
                    if (error.status === 401) {
                        router.push('/login');
                    }
                    toast.error(error.message, { autoClose: 5000 });
                } else {
                    toast.error('Unexpected error occurred please try again later.', { autoClose: 5000 });
                }
            }
        }
        fetchBoardInfo();
    }, [id]);


    const handleClose = useCallback(() => {
        setShowMenu(false);
    }, []);

    if (!boardInfo) {
        return <Overlay onCLick={null}><CustomSpinner size={50} color='white' borderWidth={4} marginTop={typeof window !== 'undefined' ? window.innerHeight / 2 : 200} /></Overlay>;
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.boardContent}`}>
                <div className={styles.boardInformation}>
                    <h2>{boardInfo.title}</h2>
                    <button onClick={() => setShowMenu(!showMenu)}>...</button>
                </div>
                <div className={styles.cardsContainer}>
                    <DragAndDropProvider items={boardInfo.columns.map(col => `column-${col._id}`)}>
                        {boardInfo.columns.map((col) =>
                            <Column key={col._id} data={col} overlay={null} />)}
                    </DragAndDropProvider>
                    <AddColumn boardId={id as string}/>
                </div>
            </div>
            <div className={`${styles.boardMenu} ${showMenu ? styles.grow : ''}`}>
                <BoardMenu onClose={handleClose} />
            </div>
            {selectedCardId && <CardDetails cardId={selectedCardId} />}
        </div>
    );
}