import type { ReactNode } from 'react';
import Navbar from '@/app/navbar/page';
import BoardContextProvider from '@/context/boardContext';
import { CardContextProvider } from '@/context/cardContext';
import UserContextProvider from '@/context/userContext';
import WebsocketContextProvider from '@/context/websocketContext';
export default function BoardLayout({children} : {children : ReactNode}){
    
    return(
        <div>
            <UserContextProvider>
            <BoardContextProvider>
                <WebsocketContextProvider>
                <Navbar/>
                <CardContextProvider>
                    {children}
                </CardContextProvider>
                </WebsocketContextProvider>
            </BoardContextProvider>
            </UserContextProvider>
        </div>     
    )
}