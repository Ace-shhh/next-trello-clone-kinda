'use client'
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js'

type PusherOptions = {
    channelName : string;
    eventName : string;
    handler : (data : any)=> void;
}

export function usePusherSubscription({channelName, eventName, handler} : PusherOptions){
    const [socketId, setSocketId] = useState<string | undefined>(undefined)

    useEffect(()=>{
        if(!channelName) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
            cluster : process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        });

        pusher.connection.bind('connected', ()=>{
            setSocketId(pusher.connection.socket_id);
        });

        const channel = pusher.subscribe(channelName);
        channel.bind(eventName, handler);

        alert(`pusher connection established ${channelName}`)

        return ()=>{
            channel.unbind(eventName, handler);
            pusher.unsubscribe(channelName);
            pusher.disconnect();
            alert('Pusher subscription disconnected');
        }

    },[channelName, eventName, handler]);

    return socketId;
};