import type { ReactNode } from 'react';
import Navbar from '../navbar/page';
export default function workspacesLayout({children} : {children : ReactNode}){
    
    return(
        <>
        <Navbar/>
        {children}
        </>
    )
}