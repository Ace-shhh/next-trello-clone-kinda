import styles from './addBoard.module.scss';
import { FormEvent, useEffect, useState, useRef } from 'react';
import { createBoard } from '@/services/boardService';
import { toast } from 'react-toastify';
import { CustomError } from '@/app/lib/definitions';
import { useUserContext } from '@/context/userContext';
import { IoAddOutline } from "react-icons/io5";
import Overlay from '../../overlay/Overlay';

export default function AddBoard({workspaceId} : {workspaceId : string}){
    const [add, setAdd] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement | null>(null);
    const { setUserInfo } = useUserContext();


    useEffect(()=>{
        if(!add) return;
        function escapeListener(e : KeyboardEvent){
            if(e.key === "Escape"){
                handleClose();
            };
        }
        document.addEventListener("keydown", escapeListener);

        return ()=>{
            document.removeEventListener("keydown", escapeListener)
        }
    },[add])

    useEffect(()=>{
        if(!add) return;

        function handleClickOutside(e : MouseEvent){
            if(formRef.current && !formRef.current.contains(e.target as Node)) {
                handleClose();
            };
        };

        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[add])

    async function handleSubmit(e : FormEvent){
        e.preventDefault();
        
        if(loading) return;

        const titleTrim = title.trim();
        const descriptionTrim = description.trim();

        if(!titleTrim){
            return;
        };
        
        try{
            setLoading(true);

            const newBoard = await createBoard({title : titleTrim, description : descriptionTrim, workspaceId});

            if(!newBoard){
                throw new CustomError('Something went wrong, Failed to create Board');
            };

            setUserInfo(prev => {
                if(!prev) return prev;

                const updatedWorkspaces = prev.ownWorkspaces.map((workspace)=>{
                    if(workspace._id === workspaceId){
                        return {...workspace, boards : [...workspace.boards, newBoard]}
                    }
                    return workspace;
                })

                return {...prev, ownWorkspaces : updatedWorkspaces}
            })

        }
        catch(error){
            if(error instanceof CustomError){
                toast.error(error.message, { autoClose : 5000});
                if(error.status === 500){
                    setError(true)
                    setErrorMessage(error.message)
                };
                // add error handling for not authenticated/unauthorized user
            }else{
                toast.error("Unexpected error occured", { autoClose : 5000})
                console.log(error);
            }
            setError(true);
        }
        finally{
            setLoading(false);
            handleClose();
        }
    }

    function handleClose(){
        setTitle('');
        setDescription('');
        setAdd(false);
    }

    function handleClick(){
        if(error){
            toast.error(errorMessage, { autoClose : 5000})
        }
        else{
            setAdd(!add);
        }

    };

    return(
        <div>
            <button className={styles.button} onClick={handleClick}><IoAddOutline size={20}/>Add Board</button>
            {add && 
                    <Overlay>
                        <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
                            <label>Board Title : </label>
                            <input className={styles.formInput} type='text' placeholder='Enter title...' value={title} onChange={(e)=> setTitle(e.target.value)} required={true} disabled={error}/>
                            <label>Description : </label>
                            <input className={styles.formInput} type='text' placeholder='Enter description' value={description} onChange={(e)=> setDescription(e.target.value)} disabled={error}/>
                            <button className={styles.saveButton} type='submit'>{loading ? <div className={styles.loadingSpinner}/> : 'Save'}</button>
                            <button className={styles.cancelButton} onClick={(e)=> {e.preventDefault(); handleClose()}}>X</button>
                        </form>
                    </Overlay>
            }
        </div>
    )
}