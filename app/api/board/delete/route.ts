import {NextResponse, NextRequest} from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Board } from '@/app/lib/models';
import { Workspace } from '@/app/lib/models';

export async function DELETE(request : NextRequest){
    const { searchParams } = request.nextUrl;

    const boardId= searchParams.get('boardId');
    const wsId = searchParams.get('wsId');
    const userId = request.headers.get('x-user-id');
    
    if(!userId || !boardId || !wsId){
        return NextResponse.json(
            {error : 'Required parameters missing'},
            {status : 422},
        );
    };

    await connectToDatabase();
    
    try{
        const workspace = await Workspace.findOne({
            _id : wsId,
            boards: boardId,
            "members.userId" : userId,
        });

        if(!workspace){
            return NextResponse.json(
                {error : 'Workspace not found'},
                {status : 404},
            );
        };

        const isUserTheOwner = workspace.members.some(member=> member.userId.toString() === userId && member.role === 'owner');

        if(!isUserTheOwner){
            return NextResponse.json(
                {error : 'Unauthorized action'},
                {status : 401},
            );
        };

        
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            wsId,
            {$pull : {boards : boardId}},
        );
        
        if(!updatedWorkspace){
            return NextResponse.json(
                {error : 'Failed to delete board in workspace'},
                {status : 501},
            );
        };

        const updatedBoard = await Board.findByIdAndDelete(boardId);
        
        if(!updatedBoard){
            return NextResponse.json(
                {error : 'Board not found'},
                {status : 404},
            );
        };

        return NextResponse.json(null, {status : 200});
    }
    catch(error : unknown){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        );
    };
};