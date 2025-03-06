import type { ReactNode } from 'react';
import Navbar from '@/app/navbar/page';
import BoardContextProvider from '@/context/boardContext';
import { CardContextProvider } from '@/context/cardContext';
import UserContextProvider from '@/context/userContext';
export default function BoardLayout({children} : {children : ReactNode}){
    return(
        <div>
            <UserContextProvider>
            <BoardContextProvider>
                <Navbar/>
                <CardContextProvider>
                    {children}
                </CardContextProvider>
            </BoardContextProvider>
            </UserContextProvider>
        </div>     
    )
}