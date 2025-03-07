import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { Board } from '@/app/lib/models';

export async function PATCH(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const boardId = searchParams.get('boardId');
    const columnId = searchParams.get('columnId');
    const action = searchParams.get('action');

    if(!boardId || !columnId || !action){
        return NextResponse.json(
            {error : 'Missing required fields'},
            {status : 400},
        );
    };

    await connectToDatabase();

    try{
        let updatedBoard;
        if(action === 'archive'){
            updatedBoard = await Board.findByIdAndUpdate(
                boardId,
                {
                    $pull : {columns : columnId},
                    $push : {archive : columnId}
                },
            );
        }
        else{
            updatedBoard = await Board.findByIdAndUpdate(
                boardId,
                {
                    $pull : {archive : columnId},
                    $push : {columns : columnId}
                },
                {new : true},
            ).populate({path : 'columns', populate : 'cards'})
        };

        if(!updatedBoard){
            return NextResponse.json(
                {error : 'Invalid or missing boardId'},
                {status : 404},
            );
        };

        return NextResponse.json({data : updatedBoard});
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    };
}