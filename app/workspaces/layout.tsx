import type { ReactNode } from 'react';
import Navbar from '../navbar/page';
import UserContextProvider from '@/context/userContext';
export default function workspacesLayout({children} : {children : ReactNode}){
    
    return(
        <UserContextProvider>
        <Navbar/>
        {children}
        </UserContextProvider>
    )
}