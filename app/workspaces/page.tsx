'use client'
import styles from './page.module.scss';
import Workspace from '../components/workspace/workspace';
import { IWorkspace } from '../lib/definitions';
import { useEffect, useState } from 'react';
import { User } from '@/app/lib/definitions';

export default function Workspaces(){
    const [userInfo, setUserInfo] = useState<User>();

    useEffect(()=>{
        const storedUser = localStorage.getItem('userInfo') || null;
        const parsed = storedUser? JSON.parse(storedUser) : null;
        setUserInfo(parsed);
    },[])

    if(!userInfo){
        return <div> Loading.. </div>
    }

    return(
        <div className={styles.container}>
            <div>
                <h1>Your Workspaces</h1>
                {userInfo.ownWorkspaces.map((ws : IWorkspace, index : number)=><Workspace key={index} data={ws} />)}
            </div>
            <div>
                <h1>Other Workspaces</h1>
            </div>
        </div>
    )
}