import { CustomError } from '@/app/lib/definitions';
import styles from './archive.module.scss';
import { useBoardState, useBoardDispatch } from '@/context/boardContext';
import { FaUndo } from "react-icons/fa";
import { toast } from 'react-toastify';
import { archiveColumn } from '@/services/boardService';
export default function Archive(){
    const { boardInfo } = useBoardState();
    const { setBoardInfo } = useBoardDispatch();

    if(!boardInfo){
        return <div>Loading..</div>
    }

    async function handleClick(columnId : string){
        if(!boardInfo) return;
        try{
            const updatedBoard = await archiveColumn(boardInfo._id, columnId, 'unArchive');
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const updatedArchive = prev.archive.filter(arc=> arc._id !== columnId);
                return {...prev, columns : updatedBoard.columns, archive : updatedArchive};
            });
        }
        catch(error){
            if(error instanceof CustomError){
                toast.error(error.message);
            }else{
                toast.error(String(error))
            }
        }
    }

    return(
        <div className={styles.container}>
            {boardInfo.archive.map(arc=>{
                return(    
                    <div key={arc._id} className={styles.archiveItem}>
                      <span>{arc.title}</span>
                      <button onClick={()=>handleClick(arc._id)}><FaUndo size={10} className={styles.icon} />Send to board</button>  
                    </div>
                )
            })}
        </div>
    )
}