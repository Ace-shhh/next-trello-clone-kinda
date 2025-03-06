import UserContextProvider from "@/context/userContext";
import { ReactNode } from "react";

export default function NavbarLayout({children} : {children : ReactNode}){
    return(
        <UserContextProvider>
            {children}
        </UserContextProvider>
    )
}