import styles from './activity.module.scss';
import CommentTemplate from './commentTemplate/commentTemplate';
import AddComment from './addComment/addComment';
import { useBoardState } from '@/context/boardContext';
import { useEffect } from 'react';
import { GrList } from "react-icons/gr";

export default function Activity(){
    const { cardInfo } = useBoardState();

    if(!cardInfo) return <div>Loading...</div>

    useEffect(()=>{
        console.log(cardInfo)
    },[])

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <GrList className={styles.icon} size={25}/>
                <span>Activity</span>
            </div>
            <AddComment/>
            { cardInfo.comments?.map(comment=>
                <CommentTemplate key={comment._id} commentInfo={comment}/>
            )}
        </div>
    )
}