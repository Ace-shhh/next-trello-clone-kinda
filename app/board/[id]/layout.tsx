import type { ReactNode } from 'react';
import Navbar from '@/app/navbar/page';
import BoardContextProvider from '@/context/boardContext';
import { CardContextProvider } from '@/context/cardContext';
export default function BoardLayout({children} : {children : ReactNode}){
    return(
        <div>
            <BoardContextProvider>
                <Navbar/>
                <CardContextProvider>
                    {children}
                </CardContextProvider>
            </BoardContextProvider>
        </div>     
    )
}