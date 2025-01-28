import type { ReactNode } from 'react';
import Navbar from '@/app/navbar/page';
import BoardContextProvider from '@/context/boardContext';
export default function BoardLayout({children} : {children : ReactNode}){
    return(
        <div>
            <BoardContextProvider>
            <Navbar/>
            {children}
            </BoardContextProvider>
        </div>     
    )
}