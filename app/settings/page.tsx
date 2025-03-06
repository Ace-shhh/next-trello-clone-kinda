'use client'
import styles from './page.module.scss';
import { useState } from 'react';
import EditProfile from '../components/settings/editProfile/editProfile';

export default function Settings(){
    const [displayNumber, setDisplayNumber] = useState<Number>(1);
    
    
    
    return(
        <div className={styles.container}>
            <div className={styles.settingsDiv}>
                <h1>Settings</h1>
                <button onClick={()=> setDisplayNumber(1)}>Edit user profile</button>
            </div>
            <div className={styles.displayContainer}>
                {displayNumber === 1 ? (
                    <EditProfile/>
                ) : (null)}
                
            </div>
        </div>
    )
}