import styles from './deleteBoard.module.scss';
import { useState } from 'react';
import { RiDeleteBin7Line } from "react-icons/ri";
import { MdExitToApp } from "react-icons/md";
import Overlay from '@/app/components/overlay/Overlay';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import { deleteBoard } from '@/services/boardService';


export default function DeleteBoard(){
    const [confimation, setConfirmation] = useState<boolean>(false);
    const router = useRouter();
    const { setUserInfo } = useUserContext();
    
    const searchParams = useSearchParams();
    const params = useParams();
    const boardId = params.id as string;
    const wsId = searchParams.get('wsId') as string;
    const role = searchParams.get('role');

    function handleClick(e : React.MouseEvent){
        e.stopPropagation();
        setConfirmation(true);
    }

    async function handleDelete(){
        if(!boardId || !wsId) return;

        try{
            const updatedBoard = await deleteBoard(boardId, wsId)
            setUserInfo(prev=>{
                if(!prev) return prev;
                const updatedOwnWorkspaces = prev.ownWorkspaces.map(ws=>{
                    if(ws._id === wsId){
                        const updatedBoards = ws.boards.filter(board=> board._id !== boardId);
                        return {...ws, boards : updatedBoards};
                    };
                    return ws;
                });

                return {...prev, ownWorkspaces : updatedOwnWorkspaces};
            });
            
            router.push('/workspaces');
            toast.success('Board deleted successfully');
        }
        catch(error : unknown){
            if(error instanceof CustomError){
                toast.error(error.message);
            }
            else{
                toast.error(String(error));
            };
        };
    };
    
    return(
        <div className={styles.container}>
            <button className={styles.divButton} onClick={handleClick}>
                {role === 'owner' ? 
                (
                    <><RiDeleteBin7Line size={20} className={styles.leaveIcon}/> Delete board</>
                ) : (
                    <><MdExitToApp size={20} className={styles.leaveIcon}/> Leave board</>
                )}
            </button>
            
            {confimation && 
                <Overlay>
                    <div className={styles.confirmation}>
                            <h2>Are you sure you want to {role === 'owner' ? 'Delete' : 'Leave'} this board?</h2>
                            <div className={styles.buttonsCtn}>
                                <button onClick={handleDelete}>YES</button>
                                <button onClick={()=>{setConfirmation(false)}}>CANCEL</button>
                            </div>
                    </div>
                </Overlay>
            }
        </div>
    )
}