import { IComment } from '@/app/lib/definitions';
import styles from './commentTemplate.module.scss';
import ProfilePicture from '@/app/components/user/profilePicture/profilePicture';

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
                <ProfilePicture customProfilePicture={commentInfo.user.profilePicture} customUserName={commentInfo.user.username} hoverEffect={false} size={30}/>
            </div>
            <div>
                <span className={styles.userName}>{commentInfo.user.username}</span>
                <span className={styles.date}>{date}</span>
            </div>
            <div className={styles.commentDiv}>{commentInfo.comment}</div>
        </div>
    )
}