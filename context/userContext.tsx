'use client'
import { User } from '@/app/lib/definitions';
import { useState, useContext, createContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';

interface UserStateContextType {
    userInfo?: User;
    loading: boolean;
    socketId: string | undefined;
    pusher?: Pusher;
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
    const [socketId, setSocketId] = useState<string | undefined>(undefined);
    const [pusher, setPusher] = useState<Pusher>();
    const router = useRouter();
    const pusherInstanceRef = useRef<Pusher | null>(null);

    console.log('context provider restarted')

    const NotificationHandler = useCallback((event : any)=>{
        console.log("Received notification event : ", event);
    },[])

    useEffect(()=>{
        if(!userInfo) return;

        if(!pusherInstanceRef.current){
            const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
            const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;
        
            console.log('Pusher connection establishing')
    
            const pusherInstance = new Pusher(
                pusherKey, {
                    cluster : pusherCluster
                }
            );
    
            const channel = pusherInstance.subscribe(userInfo._id);
            console.log(`pusher subribed to ${userInfo._id}`);
            channel.bind('Notifications', NotificationHandler);
            setPusher(pusherInstance);
            setSocketId(pusherInstance.connection.socket_id);
            pusherInstanceRef.current = pusherInstance;
        }   

        return ()=>{
            console.log('Pusher connection CLEANING UP');
            if(pusherInstanceRef.current){
                pusherInstanceRef.current.unbind_all();
                pusherInstanceRef.current.disconnect();
                pusherInstanceRef.current = null;
            }
            setPusher(undefined);
        }
    },[userInfo, NotificationHandler])


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
        <UserStateContext.Provider value={{userInfo, loading, socketId, pusher}}>
        <UserDispatchContext.Provider value={{setUserInfo, login, logout}}>
            {children}
        </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}