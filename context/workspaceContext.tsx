'use client'
import { useContext, createContext, useState, ReactNode } from "react"
import { IWorkspace } from "@/app/lib/definitions";

interface WorkspaceContexType{
    ownWorkspaces : IWorkspace | null;
    setOwnWorkspaces : React.Dispatch<React.SetStateAction<IWorkspace | null>>
}

const WorkspaceContext = createContext<WorkspaceContexType | null>(null);

export function useWorkspaceContext(){
    const context = useContext(WorkspaceContext);
    if(!context){
        throw new Error('useWorkspace context must be used inside WorkspaceContextProvider')
    }
    return context;
}


export default function WorkspaceContextProvider({ children } : { children : ReactNode }){
    const [ownWorkspaces, setOwnWorkspaces] = useState<IWorkspace | null>(null);


    return(
        <WorkspaceContext.Provider value={{ownWorkspaces, setOwnWorkspaces}}>
            {children}
        </WorkspaceContext.Provider>
    )
}