'use client'
import styles from './AddWorkspace.module.scss';
import { useState, useEffect } from 'react';
import Overlay from '../../overlay/Overlay';
import { createWorkspace } from '@/services/workspaceService';
import { useUserContext } from '@/context/userContext';
import { CustomError } from '@/app/lib/definitions';
import { IoAddOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { IoMdAdd } from "react-icons/io";

interface addWorkspaceProps{
    type : 'button' | 'div';
}

export default function AddWorkspace({type} : addWorkspaceProps){
    const [createNew, setCreateNew] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const { userInfo, setUserInfo } = useUserContext();

    useEffect(()=>{
        if(!createNew) return;
        const handleEscape = (event : KeyboardEvent) =>{
            if(loading) return;
            
            if(event.key === 'Escape'){
                setCreateNew(false);
            };
        };
        
        document.addEventListener("keydown", handleEscape);
        
        return () =>{
            document.removeEventListener("keydown", handleEscape);
        };
    },[createNew])

    if(!userInfo){
        return <div>Loading...</div> 
    }

    async function handleSubmit(e : React.FormEvent){
        e.preventDefault();
        if(!userInfo){
            return;
        };
        try{
            setLoading(true);
            const newWorkspace = await createWorkspace({name, description, userId : userInfo._id});

            if(!newWorkspace){
                setError(true);
                throw new Error("Something went wrong. Failed to create Workspace")
            }

            setUserInfo(prev =>{
                if(!prev) return prev;
                return{
                    ...prev, ownWorkspaces : [...prev.ownWorkspaces, newWorkspace]
                };
            });
        }
        catch(error){
            if(error instanceof CustomError){
                toast.error(`Error : ${error.message}`, { autoClose : 5000});
                console.log(error.message);
                if(error.status === 500){
                    setError(true);
                    setErrorMessage(error.message);
                };
            }
            else{
                toast.error("Unexpected error occured.", {autoClose : 5000});
                console.log(error);
            }
        }
        finally{
            setLoading(false);
            setCreateNew(false);
        };
    }

    function handleClose(e: React.FormEvent){
        e.preventDefault();
        setName('');
        setDescription('');
        setCreateNew(false)
    };

    function handleAdd(){
        if(error){
            alert(errorMessage);
        }else{
            setCreateNew(true);
        }
    }

    return(
        <div className={styles.container}>
            {createNew && 
                <Overlay>
                    <div className={styles.container}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <label>Workspace Name</label>
                            <input 
                                type='text' 
                                placeholder='Enter name' 
                                value={name}
                                onChange={(e)=> setName(e.target.value)}
                                required={true}
                            />
                            <label>Workspace Description</label>
                            <input 
                                type='text' 
                                placeholder='Enter description' 
                                value={description}
                                onChange={(e)=> setDescription(e.target.value)}
                            />
                            <button type='submit' disabled={loading} >{loading? <div className={styles.spinner}/> : 'Save'}</button>
                            <button onClick={handleClose}>Cancel</button>
                        </form>
                    </div>
                </Overlay>
            }
            { type === 'button' ? (
                <button 
                className={`${styles.createWorkspaceButton} ${error ? styles.error : null}`} 
                onClick={handleAdd}>
                    <IoAddOutline size='20'/>Create workspace
                </button>
            ) : (
                <div className={styles.createWorkspaceDiv} onClick={handleAdd}>
                    <IoMdAdd className={styles.icon} size={50}/>
                    <h3>Create new workspace</h3>
                    <span>Organize your boards and collaborate with your team</span>
                </div>
            )}
        </div>  
    )
}