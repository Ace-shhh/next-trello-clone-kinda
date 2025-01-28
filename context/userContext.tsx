'use client'
import {User} from '@/app/lib/definitions'
import { useState, useContext, createContext, ReactNode} from 'react';
import { useRouter } from 'next/navigation'

interface UserContextType {
    userInfo? : User;
    setUserInfo : React.Dispatch<React.SetStateAction<User | undefined>>;
    login : (email : string, password : string) => void;
};

const UserContext = createContext <UserContextType | null>(null);

export function useUserContext() {
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
} 

export default function UserContextProvider({children} : {children : ReactNode}){
    const [userInfo, setUserInfo] = useState<User>(); 
    const router = useRouter();

    const login: UserContextType['login']= async(email, password) =>{
        try{
            const response = await fetch('/api/user', {
                method : 'POST',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify({email, password})
            })

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to log in")
            }
            
            const json = await response.json();
            setUserInfo(json.data)
            localStorage.setItem('userInfo', JSON.stringify(json.data))
            router.push('/workspaces')
        }
        catch(error : any){
            console.log(error);
            alert(error.message);
        }
    }

    return(
        <UserContext.Provider value={{userInfo, setUserInfo, login}}>
            {children}
        </UserContext.Provider>
    )
}
