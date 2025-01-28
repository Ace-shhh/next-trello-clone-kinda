import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Board } from '@/app/lib/models/index';


export async function POST(request : NextRequest){

    const body = await request.json();
    const { id } = body;
    
    await connectToDatabase();

    try{
        const board = await Board.findById(id).populate(
            {path : 'columns', populate : 'cards'},
        );

        if(!board){
            return NextResponse.json(
                {error : 'Board not found'},
                {status : 404}
            );
        };

        return NextResponse.json(
            {data : board}
        )

    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    }
}