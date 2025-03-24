import type { ReactNode } from 'react';
import Navbar from '../navbar/page';
import UserContextProvider from '@/context/userContext';
import WebsocketContextProvider from '@/context/websocketContext';
export default function workspacesLayout({children} : {children : ReactNode}){
    
    return(
        <UserContextProvider>
        <WebsocketContextProvider>
        <Navbar/>
        {children}
        </WebsocketContextProvider>
        </UserContextProvider>
    )
}