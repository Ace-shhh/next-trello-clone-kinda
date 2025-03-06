'use client'
import styles from './accountMenu.module.scss'
import { useUserContext } from '@/context/userContext'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfilePicture from '../../user/profilePicture/profilePicture'
export default function AccountMenu(){
    const [menu, setMenu] = useState<boolean>(false);
    const { userInfo, logout } = useUserContext();
    const menuRef = useRef<HTMLDivElement | null>(null);
    const togglerRef = useRef<HTMLSpanElement | null>(null);
    const router = useRouter();

    useEffect(()=>{
        function handleClickOutside(event : MouseEvent){
            const isClickOnToggler = togglerRef.current?.contains(event.target as Node);
            const isCLickOnMenu = menuRef.current?.contains(event.target as Node);

            if(!isClickOnToggler && !isCLickOnMenu){
                setMenu(false);
            };
        };
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);


    if(!userInfo) return <div></div>

    return(
        <div className={styles.container}>
            <span ref={togglerRef} onClick={()=>setMenu(!menu)}>
                <ProfilePicture customProfilePicture={null} customUserName={null} hoverEffect={true} size={30}/>
            </span>
            {menu && 
                <div className={styles.menu} ref={menuRef}>
                    <div className={styles.account}>
                        <h2>Account</h2>

                        <div className={styles.accountDiv}>
                            <ProfilePicture customProfilePicture={null} customUserName={null} hoverEffect={false} size={40}/>
                            <div className={styles.nameEmailDiv}>
                                <span>{userInfo.username}</span>
                                <span>{userInfo.email}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={()=> router.push('/settings')}>Settings</button>
                    <button onClick={()=> logout()}>Logout</button>
                </div>
            }
        </div>
    )
}