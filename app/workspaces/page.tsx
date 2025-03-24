'use client'
import styles from './page.module.scss';
import { useCallback } from 'react';
import { useUserStateContext, useUserDispatchContext } from '@/context/userContext';
import { IWorkspace, IBoard } from '../lib/definitions';
import AddWorkspace from '../components/workspaces/addWorkspace/AddWorkspace';
import Workspace from '../components/workspaces/workspace/workspace';
import useWorkspacesSubscription from '../hooks/useWorkspacesSubscription';

interface WorkspaceEventType{
    action : string;
    wsId : string;
    newBoard : IBoard;
};

export default function Workspaces(){

    const { userInfo } = useUserStateContext();
    const { setUserInfo } = useUserDispatchContext();

    const WorkspaceHandler = useCallback((event : WorkspaceEventType) : void => {
        if(event.action === 'createBoard'){
            setUserInfo(prev=>{
                if(!prev) return prev;

                const ownIndex = prev.ownWorkspaces.findIndex(ws=> ws._id === event.wsId);
                const otherIndex = prev.ownWorkspaces.findIndex(ws=> ws._id === event.wsId);

                let updatedOwn = prev.ownWorkspaces;
                let updatedOther = prev.otherWorkspaces;

                if(ownIndex !== -1){ 
                    updatedOwn = prev.ownWorkspaces.map(ws=>{
                        if(ws._id === event.wsId){
                            return {...ws, boards : [...ws.boards, event.newBoard]};
                        };
                        return ws;
                    });
                }

                if(otherIndex !== -1){ 
                    updatedOther = prev.otherWorkspaces.map(ws=>{
                        if(ws._id === event.wsId){
                            return {...ws, boards : [...ws.boards, event.newBoard]};
                        };
                        return ws;
                    });
                }

                return {...prev, ownWorkspaces : updatedOwn, otherWorkspaces : updatedOther};
            });
        };
    },[]);

    useWorkspacesSubscription(WorkspaceHandler);

    if(!userInfo){
        return <div>Loading...</div>
    };

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