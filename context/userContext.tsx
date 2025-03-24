'use client'
import { User } from '@/app/lib/definitions';
import { useState, useContext, createContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserStateContextType {
    userInfo?: User;
    loading: boolean;
};

interface UserContextDispatchType{
    setUserInfo: React.Dispatch<React.SetStateAction<User | undefined>>;
    login: (email: string, password: string) => void;
    logout: () => void;
}

const UserStateContext = createContext<UserStateContextType | null>(null);
const UserDispatchContext = createContext<UserContextDispatchType | null>(null);

export function useUserStateContext() {
    const context = useContext(UserStateContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};

export function useUserDispatchContext() {
    const context = useContext(UserDispatchContext);
    if(!context){
        throw new Error('useUserDispatchContext must be used within a UserContextProvider');
    }
    return context;
};

export default function UserContextProvider({ children }: { children: ReactNode }) {
    const [userInfo, setUserInfo] = useState<User>();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('userInfo');
            if (cached) {
                setUserInfo(JSON.parse(cached));
            }
        }
    }, []);
    
    useEffect(() => {
        if (userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
    }, [userInfo]);

    const login: UserContextDispatchType['login'] = async (email, password) => {
        try {
            setLoading(true);
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || "Failed to log in");
            }
            setUserInfo(json.data);
            router.push('/workspaces');
        } catch (error: any) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    async function logout() {
        try {
            const response = await fetch('/api/user/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                router.push('/login');
                setUserInfo(undefined);
                localStorage.removeItem('userInfo');
            }
        } catch (error: unknown) {
            console.log('Logout error', error);
        }
    };

    return (
        <UserStateContext.Provider value={{userInfo, loading}}>
        <UserDispatchContext.Provider value={{setUserInfo, login, logout}}>
            {children}
        </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}