'use client'
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import { toast } from 'react-toastify';
import { CustomError } from '@/app/lib/definitions';
import { getBoard } from '@/services/boardService';
import { useUserStateContext } from '@/context/userContext';

import AddColumn from '@/app/components/board/addColumn';
import Column from '@/app/components/column/column';
import DragAndDropProvider from '@/app/components/dragAndDrop/DragAndDropProvider';
import CardDetails from '@/app/components/card/cardDetails/cardDetails';
import BoardMenu from '@/app/components/board/boardMenu/boardMenu';
import Overlay from '@/app/components/overlay/Overlay';
import CustomSpinner from '@/app/components/loading/CustomSpinner/customSpinner';

export default function Board() {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const { setBoardInfo } = useBoardDispatch();
    const { boardInfo, selectedCardId } = useBoardState();
    const { socketId, pusher } = useUserStateContext();

    const params = useParams();
    const searchParams = useSearchParams();
    const { id } = params;
    const boardId = id as string;
    const wsId = searchParams.get('wsId') ?? '';
    const router = useRouter();

    useEffect(() => {
        async function fetchBoardInfo() {
            console.log('fetching board info');
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
        return <Overlay><CustomSpinner size={50} color='white' borderWidth={4} marginTop={typeof window !== 'undefined' ? window.innerHeight / 2 : 200} /></Overlay>;
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
                    <AddColumn boardId={id as string} socketId={socketId ? socketId : ''} />
                </div>
            </div>
            <div className={`${styles.boardMenu} ${showMenu ? styles.grow : ''}`}>
                <BoardMenu onClose={handleClose} />
            </div>
            {selectedCardId && <CardDetails id={selectedCardId} />}
        </div>
    );
}