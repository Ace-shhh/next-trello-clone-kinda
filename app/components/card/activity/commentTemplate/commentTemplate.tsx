import { IComment } from '@/app/lib/definitions';
import styles from './commentTemplate.module.scss';
import ProfilePicture from '@/app/components/user/profilePicture/profilePicture';
import { useRef, useEffect, useState } from 'react';
import { timeStamp } from 'console';

export default function CommentTemplate({commentInfo} : {commentInfo : IComment}){
    
    const [newComment, setNewComment] = useState<boolean>(false);
    const [dateToShow, setDateToShow] = useState<string>('');
    const stopRef = useRef<boolean>(false);

    const timeStampMs = new Date(commentInfo.createdAt).getTime();
    const currDate = Date.now();
    const passed = currDate - timeStampMs;

    function setNormalDate(){
        const date = new Date(commentInfo.createdAt).toLocaleString('en-US',{
            year: 'numeric',
            month: 'short',
            day : 'numeric',
            hour : 'numeric',
            minute : 'numeric',
        });
        stopRef.current = true;
        setDateToShow(date);
    }

    useEffect(()=>{
        if(passed < 600000){
            const minute = 60000;
            const intervalId = setInterval(()=>{
                console.log('interval fired')
                const currentPassed = Date.now() - timeStampMs;
    
                if(currentPassed <= minute){
                    setDateToShow('Just now');
                }
                else if(currentPassed > minute && currentPassed < minute * 2){
                    setDateToShow('2 minutes ago')
                }
                else if(currentPassed >= minute * 3 && currentPassed < minute * 4){
                    setDateToShow('3 minutes ago');
                }
                else if(currentPassed >= minute * 4 && currentPassed < minute * 5){
                    setDateToShow('4 minutes ago');
                }
                else if(currentPassed >= minute * 5 && currentPassed < minute * 6){
                    setDateToShow('5 minutes ago');
                }
                else if(currentPassed >= minute * 6 && currentPassed < minute * 7){
                    setDateToShow('6 minutes ago');
                }                
                else if(currentPassed >= minute * 7 && currentPassed < minute * 8){
                    setDateToShow('7 minutes ago');
                }
                else if(currentPassed >=minute * 8 && currentPassed < minute * 9){
                    setDateToShow('8 minutes ago');
                }
                else if(currentPassed >= minute * 9 && currentPassed < minute * 10){
                    setDateToShow('9 minutes ago');
                }
                else{
                    setNormalDate();
                    clearInterval(intervalId);
                }
            }, 1000);
        }
        else{
            setNormalDate();
        }
            
    },[commentInfo]);

    useEffect(()=>{
        if(passed <= 15000){
            setNewComment(true);
            const timer = setTimeout(()=>{setNewComment(false);}, 5000);
            return ()=>{
                clearTimeout(timer)
            }
        }
    },[])

    return(
        <div className={`${styles.container} ${newComment? styles.slide : ''}`}>
            <div className={styles.profilePictureDiv}>
                <ProfilePicture customProfilePicture={commentInfo.user.profilePicture} customUserName={commentInfo.user.username} hoverEffect={false} size={30}/>
            </div>
            <div>
                <span className={styles.userName}>{commentInfo.user.username}</span>
                <span className={styles.date}>{dateToShow}</span>
            </div>
            <div className={`${styles.commentDiv} ${newComment? styles.newComment : ''}`}>{commentInfo.comment}</div>
        </div>
    )
}