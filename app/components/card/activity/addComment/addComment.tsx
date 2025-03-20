import styles from './addComment.module.scss';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { createComment } from '@/services/commentService';
import { CustomError } from '@/app/lib/definitions';
import { useBoardState, useBoardDispatch } from '@/context/boardContext';
import ProfilePicture from '@/app/components/user/profilePicture/profilePicture';
import { text } from 'stream/consumers';

export default function AddComment(){
    const [newComment, setNewComment] = useState<string>('');
    const [addComment, setAddComment] = useState<boolean>(false);
    const { cardInfo } = useBoardState();
    const { setCardInfo } = useBoardDispatch();
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const saved = localStorage.getItem('userInfo');
    const userInfo = saved? JSON.parse(saved) : null;


    useEffect(()=>{
        function escapeListener(e : KeyboardEvent){
            if(e.key === 'Escape'){
                setAddComment(false);
            };
        };
        document.addEventListener('keydown', escapeListener);
        return ()=>{
            document.removeEventListener('keydown', escapeListener)
        };
    },[]);

    useEffect(()=>{
        if(textAreaRef.current){
            textAreaRef.current.select();
        }
    },[addComment])

    async function handleSave(){
        if(!userInfo) return;
        if(!cardInfo) return;

        try{
            const result = await createComment({comment : newComment, cardId : cardInfo._id, userId : userInfo._id});

            setCardInfo(prev=>{
                if(!prev) return prev;
                if(!prev.comments) return {...prev, commments : [result]};
                return {...prev, comments : [result, ...prev.comments]}
            })
        }
        catch(error){
            if(error instanceof CustomError){
                toast.error(error.message);       
            }
            else{
                toast.error(String(error))
            };
        }
        finally{
            setAddComment(false);
        }
        ;
    };

    return(
        <div className={styles.container}>
            <ProfilePicture customProfilePicture={userInfo.profilePicture} customUserName={userInfo.username} hoverEffect={false} size={30}/>
            {
                addComment? (
                    <div className={styles.inputContainer}>
                        <textarea 
                            className={styles.commentInput} 
                            value={newComment} 
                            onChange={(e)=>setNewComment(e.target.value)}
                            ref={textAreaRef}
                        />
                        <button className={styles.saveButton} onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <button onClick={()=>setAddComment(!addComment)} className={styles.commentButton}>Write a comment...</button>
                )
            }
        </div>
    )
}