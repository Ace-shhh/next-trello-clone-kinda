'use client'
import styles from './page.module.scss';
import Workspace from '../components/workspaces/workspace/workspace';
import { IWorkspace } from '../lib/definitions';
import AddWorkspace from '../components/workspaces/addWorkspace/AddWorkspace';
import { useUserStateContext } from '@/context/userContext';

export default function Workspaces(){
    const { userInfo } = useUserStateContext();

    if(!userInfo){
        return <div>Loading...</div>
    }

    return(
        <div className={styles.container}>
            <div className={styles.ownWorkspaces}>
                <div className={styles.header}>
                    <h1>Your Workspaces</h1>
                    <AddWorkspace type='button'/>
                </div>
                <div className={styles.workspacesCtn}>
                    {userInfo.ownWorkspaces.map((ws : IWorkspace, index : number)=><Workspace key={index} data={ws} role={'owner'}/>)}
                    <AddWorkspace type='div'/>
                </div>
            </div>
            <div className={styles.otherWorkspaces}>
                <h1>Other Workspaces</h1>
                <p className={styles.p}>Workspaces you've been invited to</p>
                {userInfo.otherWorkspaces.map((ws : IWorkspace, index : number)=><Workspace key={index} data={ws} role={'member'}/>)}
                {userInfo.otherWorkspaces.length === 0 && <div className={styles.noWorkspaceDiv}>No other workspaces available. Workspaces that you're invited to will appear here.</div>}
            </div>
        </div>
    )
}