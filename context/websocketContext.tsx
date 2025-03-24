'use client'
import { useEffect, useState, useContext, createContext, ReactNode, useRef, useCallback } from 'react';
import Pusher from 'pusher-js';
import { useUserStateContext } from './userContext';

interface WebsocketType{
    pusher? : Pusher;
    socketId? : string;
}

const WebsocketContext = createContext<WebsocketType | null>(null);

export function useWebsocketContext(){
    const context = useContext(WebsocketContext);
    if(!context){
        throw new Error("useWebsocketContext must be inside it's provider");
    };
    return context;
}



export default function WebsocketContextProvider({children} : {children : ReactNode}){
    const [pusher, setPusher] = useState<Pusher | undefined>(undefined);
    const [socketId, setSocketId] = useState<string | undefined>(undefined);
    const { userInfo } = useUserStateContext();
    const pusherInstanceRef = useRef<Pusher | null>(null);

    const NotificationHandler = useCallback((event : any)=>{
        console.log("Received notification event : ", event);
    },[]);
    

    useEffect(()=>{
        if(!userInfo) return;
        if(!pusherInstanceRef.current){
            const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
            const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;
            const userId = userInfo._id;

            pusherInstanceRef.current = new Pusher(
                pusherKey, {
                    cluster : pusherCluster,
                }
            );

            console.log('Websocket connected')

            const pusherInstance = pusherInstanceRef.current;

            function connectionHandler(){
                console.log('Notifications connected')
                const channel = pusherInstance.subscribe(userId);
                channel.bind('Notifications', NotificationHandler);
                setPusher(pusherInstance);
                setSocketId(pusherInstance.connection.socket_id);
                pusherInstance.connection.unbind('connected', connectionHandler);
            }

            if(pusherInstance.connection.state !== 'connected'){
                pusherInstance.connection.bind('connected', connectionHandler);
            }else{
                connectionHandler();
            }
        }   

        return ()=>{
            console.log('Websocket cleaning up')
            if(pusherInstanceRef.current){
                pusherInstanceRef.current.unbind_all();
                pusherInstanceRef.current.connection.disconnect();
                pusherInstanceRef.current = null;
            }
        }
    },[userInfo])

    return(
        <WebsocketContext.Provider value={{pusher, socketId}}>
            {children}
        </WebsocketContext.Provider>
    );
};