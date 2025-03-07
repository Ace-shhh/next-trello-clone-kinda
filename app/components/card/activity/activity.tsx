import styles from './activity.module.scss';
import CommentTemplate from './commentTemplate/commentTemplate';
import AddComment from './addComment/addComment';
import { useBoardState } from '@/context/boardContext';
import { useEffect } from 'react';
export default function Activity(){
    const { cardInfo } = useBoardState();

    if(!cardInfo) return <div>Loading...</div>

    useEffect(()=>{
        console.log(cardInfo)
    },[])

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <span></span>
                <h3>Activity</h3>
            </div>
            <AddComment/>
            { cardInfo.comments?.map(comment=>
                <CommentTemplate key={comment._id} commentInfo={comment}/>
            )}
        </div>
    )
}