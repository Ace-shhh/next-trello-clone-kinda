import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";

export async function GET(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const channelName = searchParams.get('channel');
    const eventName = searchParams.get('event');
    
    if(!channelName || !eventName){
        return NextResponse.json({message : 'Missing parameters'}, {status : 401})
    };

    try{
        const pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID as string,
            key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
            secret: process.env.PUSHER_SECRET as string,
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
            useTLS: true
        });
    
        pusher.trigger(channelName, eventName, 'working');
    
        return NextResponse.json(
            {message : 'Success'},
            {status : 200}
        )
    }
    catch(error){
        console.log(error);
        return NextResponse.json({message : 'Internal server error'}, {status : 500})
    }
}