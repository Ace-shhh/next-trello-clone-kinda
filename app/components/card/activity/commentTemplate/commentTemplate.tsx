import { IComment } from '@/app/lib/definitions';
import styles from './commentTemplate.module.scss';

export default function CommentTemplate({commentInfo} : {commentInfo : IComment}){
    const date = new Date(commentInfo.createdAt).toLocaleString('en-US',{
        year: 'numeric',
        month: 'short',
        day : 'numeric',
        hour : 'numeric',
        minute : 'numeric',
    });


    

    return(
        <div className={styles.container}>
            <div className={styles.profilePictureDiv}>
                { commentInfo.user.profilePicture? 
                    (
                    <img className={styles.profilePictureImg} src={commentInfo.user.profilePicture}></img>
                    ) : (
                        <span className={styles.profilePictureSpan}>{commentInfo.user.username[0].toUpperCase()}</span>
                    ) 
                }
            </div>
            <div>
                <span className={styles.userName}>{commentInfo.user.username}</span>
                <span className={styles.date}>{date}</span>
            </div>
            <div className={styles.commentDiv}>{commentInfo.comment}</div>
        </div>
    )
}