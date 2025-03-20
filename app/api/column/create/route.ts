import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Column, Board } from '@/app/lib/models/index'
import Pusher from "pusher";

export async function POST(request : NextRequest){
    const body = await request.json();
    const { title, boardId, socketId } = body;

    connectToDatabase();

    const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID as string,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
        secret: process.env.PUSHER_SECRET as string,
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
        useTLS: true
    });

    try{
        const newColumn = new Column(
            {title : title},
        )

        await newColumn.save();
        if(!newColumn){
            return NextResponse.json(
                {error : 'Error creating new list'},
                {status : 400},
            );
        }

        //Link it to board
        try{    
            const updatedBoard = await Board.findByIdAndUpdate(
                boardId,
                {$push: {columns : newColumn._id}},
                {new : true},
            );

            if(!updatedBoard){
                return NextResponse.json(
                    {error : 'Failed to link new list created to the board'},
                    {status : 501},
                );
            };

            console.log(`board id : ${boardId}, socketID : ${socketId}`)
            
            pusher.trigger(boardId, "AddList", newColumn, {socket_id : socketId});

            return NextResponse.json(
                {data : newColumn}
            );
        }
        catch(error){   
            console.log(error)
            return NextResponse.json(
                {error : 'Internal server error'},
                {status : 500}
            )
        }

    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    }
}