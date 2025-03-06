'use client'
import styles from './page.module.scss';
import Workspace from '../components/workspaces/workspace/workspace';
import { IWorkspace } from '../lib/definitions';
import AddWorkspace from '../components/workspaces/addWorkspace/AddWorkspace';
import { useUserContext } from '@/context/userContext';

export default function Workspaces(){
    const { userInfo } = useUserContext();

    if(!userInfo){
        return <div>Loading...</div>
    }

    return(
        <div className={styles.container}>
            <div>
                <h1>Your Workspaces</h1>
                {userInfo.ownWorkspaces.map((ws : IWorkspace, index : number)=><Workspace key={index} data={ws} role={'owner'}/>)}
                <AddWorkspace/>
            </div>
            <div>
                <h1>Other Workspaces</h1>
                {userInfo.otherWorkspaces.map((ws : IWorkspace, index : number)=><Workspace key={index} data={ws} role={'member'}/>)}
            </div>
        </div>
    )
}