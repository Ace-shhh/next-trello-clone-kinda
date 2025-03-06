import styles from './boardMenu.module.scss';
import { MdExitToApp } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import { RiDeleteBin7Line } from "react-icons/ri";
import {useState} from 'react';
import React from 'react';
import Overlay from '../../overlay/Overlay';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';

function BoardMenu({onClose, role, wsId, boardId} : { onClose : ()=> void, role : string, wsId : string, boardId : string}){
    const [confimation, setConfirmation] = useState<boolean>(false);
    const { setUserInfo } = useUserContext();
    const router = useRouter();

    function handleClick(e : React.MouseEvent){
        e.stopPropagation();
        setConfirmation(true);
    }

    async function handleDelete(){
        try{
            const response = await fetch(`/api/board/delete?boardId=${boardId}&wsId=${wsId}`,{
                method : "DELETE",
                credentials : 'include'
            });

            const json = await response.json();

            if(!response.ok){
                throw new CustomError(json.error, response.status)
            }


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
            <button className={styles.closeButton} onClick={()=>onClose()}>
                <CgClose size={20}/>
            </button>
            <h3>Menu</h3>
            <div className={styles.settings}>
                <div className={styles.divButton} onClick={handleClick}>
                    {role === 'owner' ? 
                    (
                        <><RiDeleteBin7Line size={20} className={styles.leaveIcon}/> Delete board</>
                    ) : (
                        <><MdExitToApp size={20} className={styles.leaveIcon}/> Leave board</>
                    )}
                </div>
            </div>
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

export default React.memo(BoardMenu);