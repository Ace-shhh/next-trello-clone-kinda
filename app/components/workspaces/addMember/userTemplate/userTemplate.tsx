import styles from './userTemplate.module.scss'
import ProfilePicture from '@/app/components/user/profilePicture/profilePicture'

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
            <ProfilePicture customProfilePicture={profilePicture} customUserName={username} hoverEffect={false} size={30}/>
            {username}
            <input type='checkbox' onChange={(e)=>setChange(e, id)}/>
        </label>
    )
}