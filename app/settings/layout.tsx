import { ReactNode } from "react";
import UserContextProvider from "@/context/userContext";
import Navbar from "../navbar/page";
export default function SettingsLayout({children} : {children : ReactNode}){
    return(
        <UserContextProvider>
            <Navbar/>
            {children}
        </UserContextProvider>
    )
}