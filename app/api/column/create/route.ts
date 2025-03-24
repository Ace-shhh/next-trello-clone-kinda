import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Column, Board } from '@/app/lib/models/index'
import pusher from "@/app/lib/pusher";

export async function POST(request : NextRequest){
    const body = await request.json();
    const { title, boardId, socketId } = body;

    connectToDatabase();

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
            
            pusher.trigger(boardId, "ListEvent", {data : newColumn, action : 'create'}, {socket_id : socketId});

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