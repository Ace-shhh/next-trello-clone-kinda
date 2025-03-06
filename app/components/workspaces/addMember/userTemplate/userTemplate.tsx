import styles from './userTemplate.module.scss'

export default function UserTemplate(
    {
    id,
    username, 
    profilePicture, 
    setChange,
    } 
    : 
    {   
        id : string,
        username : string, 
        profilePicture : string, 
        setChange : (e : React.ChangeEvent<HTMLInputElement>, userId : string)=> void
        isChecked : boolean,
    }){
    



    return(
        <label className={styles.labelContainer}>
            {profilePicture? (
                <img src={profilePicture} className={styles.profilePictureImg}/>
                ) : (
                <span className={styles.profilePictureSpan}>{username[0].toUpperCase()}</span>
            )}
            {username}
            <input type='checkbox' onChange={(e)=>setChange(e, id)}/>
        </label>
    )
}