import styles from './columnMenu.module.scss';
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { createPortal } from 'react-dom';
import { useEffect, memo, useRef, useState } from 'react';
import { useBoardDispatch } from '@/context/boardContext';
import { archiveColumn } from '@/services/boardService';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useWebsocketContext } from '@/context/websocketContext';

function ColumnMenu({columnId} : {columnId : string}){
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const params = useParams();
    const boardId = params.id as string;
    const { socketId } = useWebsocketContext();

    const { setBoardInfo } = useBoardDispatch();
    
    useEffect(()=>{
        if(buttonRef.current){
            buttonRef.current.style.backgroundColor = showMenu ? 'grey' : 'transparent'; 
        }

        if(buttonRef.current && menuRef.current){
            const rect = buttonRef.current.getBoundingClientRect();
            menuRef.current.style.top = `${rect.bottom + 10}px`;
            menuRef.current.style.left = `${rect.left}px`;
        }
    },[showMenu])

    useEffect(()=>{
        function handleClickOutside(event : MouseEvent){
            if(
                menuRef.current && 
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ){
                setShowMenu(false);
            };
        };

        document.addEventListener('mousedown', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);
    

    function handleClick(){
        setShowMenu(!showMenu);
    };

    async function handleArchive(){
        if(!boardId || !socketId) return;

        try{
            const updatedBoard = await archiveColumn(boardId, columnId, 'archive', socketId);
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const columnToMove = prev.columns.find(col=> col._id === columnId);
                if(!columnToMove) return prev;
                const updatedColumns = prev.columns.filter(col=> col._id !== columnId);
                return {...prev, columns : updatedColumns, archive : [...prev.archive, columnToMove]}
            })
        }
        catch(error){
            if(error instanceof CustomError){
                toast.error(error.message);
            }else{
                toast.error(String(error));
            };
        };
    };

    return(
        <div className={styles.container}>
            <button ref={buttonRef} onClick={handleClick}><HiEllipsisHorizontal size={20}/></button>
            {showMenu && createPortal(
                <div 
                    className={styles.menuList} 
                    ref={menuRef}
                    onMouseDownCapture={(e) => e.stopPropagation()}
                    onDragStartCapture={(e) => e.stopPropagation()}
                    onDragCapture={(e) => e.stopPropagation()}
                >
                    <h2>List actions</h2>
                    <button onClick={handleArchive}>Archive this list</button>
                </div>,
                document.body
            )}
        </div>
    )
}

export default memo(ColumnMenu);