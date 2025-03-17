import { ReactNode } from "react";
import UserContextProvider from "@/context/userContext";

export default function GoogleLoginLayout({children} : {children : ReactNode}){
    return(
        <UserContextProvider>
            {children}
        </UserContextProvider>
    )
};