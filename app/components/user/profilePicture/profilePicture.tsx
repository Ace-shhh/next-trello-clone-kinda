import styles from './profilePicture.module.scss'
import { useCallback } from 'react'; 

interface profilePictureProps{
    customProfilePicture : string | null;
    customUserName : string | null;
    hoverEffect : boolean;
    size : number | null;
}

export default function ProfilePicture({customProfilePicture, customUserName, hoverEffect, size} : profilePictureProps){

    const setSizeRef = useCallback(
        (element : HTMLImageElement | HTMLSpanElement | null)=>{
            if(element && size){
                element.style.width = `${size}px`;
                element.style.height = `${size}px`;
                
                if(element instanceof HTMLSpanElement){
                    element.style.fontSize = `${size * 0.5}px`;
                }
            }


        },
        [size]
    );

    let userInfo : {profilePicture?: string | null, username? : string | null} | null = null;
    if(!customProfilePicture && !customUserName){
        const stored = localStorage.getItem('userInfo');
        userInfo = stored? JSON.parse(stored) : null;
    }else{
        userInfo = {
            profilePicture : customProfilePicture,
            username : customUserName,
        }
        
    }

    if(!userInfo) return <div>Loading...</div>

    return(
        userInfo.profilePicture? (
            <img  ref={setSizeRef} className={`${styles.imageAvatar} ${hoverEffect? styles.hover : ''}`} src={userInfo.profilePicture}/>
        ) : (
            <span ref={setSizeRef} className={`${styles.spanAvatar} ${hoverEffect? styles.hover : ''}`}>{userInfo.username && userInfo.username[0].toUpperCase()}</span>
        )
    )
}