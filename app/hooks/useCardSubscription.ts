'use client';

import { useWebsocketContext } from "@/context/websocketContext";
import { useEffect } from "react";

export default function useCardSubscription(channelId : string, CardHandler : (event : any)=> void){
    const { pusher, socketId } = useWebsocketContext();

    useEffect(()=>{
        if(!socketId || !pusher) return;

        
        const channel = pusher.subscribe(channelId);
        channel.bind('CardEvent', CardHandler);
        
        console.log('Card webhook connected with channelId : ', channelId);
        return ()=>{
            console.log('Cleaning up Card webhook');
            channel.unbind('CardEvent', CardHandler);
        }

    },[pusher, socketId, CardHandler]);
}