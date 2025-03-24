'use client';
import { useEffect } from 'react';
import { useWebsocketContext } from '@/context/websocketContext';

export default function useBoardSubscription(
    channelId : string,
    ListHandler : (event : any)=> void,
    CardHandler : (event : any)=> void,
){
    const { pusher, socketId } = useWebsocketContext();

    useEffect(()=>{
        if(!pusher || !socketId || !channelId) return;
        const channel = pusher.subscribe(channelId);
        channel.bind('ListEvent', ListHandler);
        channel.bind('CardEvent', CardHandler);

        return ()=>{
            channel.unbind('ListEvent', ListHandler);
            channel.unbind('CardEvent', CardHandler);
            pusher.unsubscribe(channelId);
        };
    },[pusher, socketId, channelId, ListHandler, CardHandler]);
};