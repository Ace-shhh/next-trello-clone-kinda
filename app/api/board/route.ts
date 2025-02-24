import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Board } from '@/app/lib/models/index';
import { Workspace } from "@/app/lib/models/index";
import { cookies } from 'next/headers';

export async function GET(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;
    
    if(!token) console.log('no token');
    
    if(!id){
        return NextResponse.json(
            {message : 'Board ID is required'},
            {status : 400}
        );
    };
    
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

interface createBoardRequestBody{
    title : string,
    description? : string,
    workspaceId : string,
};

export async function POST(request : NextRequest){
    const body = await request.json();
    const { title, description, workspaceId }: createBoardRequestBody = body;



    if(!title || !workspaceId){
        return NextResponse.json(
            {message : 'Title and Workspace Id is required'},
            {status : 400}
        );
    };

    try{
        const newBoard = new Board({title, description})
        await newBoard.save();

        if(!newBoard){
            return NextResponse.json(
                {message : 'Error creating new Board'},
                {status : 400},
            )
        }

        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspaceId,
            { $push : { boards : newBoard._id} },
        );

        if(!updatedWorkspace){
            return NextResponse.json(
                {message : 'Workspace not found or invalid workspace Id'},
                {status : 400}
            )
        }

        return NextResponse.json(
            {data : newBoard},
            {status: 201}
        )

    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {message : 'Internal server error'},
            {status : 500}
        )
    }
}

export async function PUT(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    const data = await request.json();

    try{
        const updatedBoard = await Board.findByIdAndUpdate(
            id,
            {columns : data}
        );

        if(!updatedBoard){
            return NextResponse.json(
                {error : `Could not find board with id : ${id}`},
                {status : 404}
            )
        };

        return NextResponse.json(updatedBoard);
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        );
    };
};