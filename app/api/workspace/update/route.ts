import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from "@/app/lib/mongodb";
import { Workspace, User } from '@/app/lib/models';

export async function POST(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const workspaceId = searchParams.get('workspaceId');
    const body = await request.json();

    await connectToDatabase();

    const newMembers = body.data.map((member : string)=> ({userId : member, role : 'member'}))

    try{
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspaceId,
            {$push : {members : {$each : newMembers}}},
            {new : true},
        );

        if(!updatedWorkspace){
            return NextResponse.json(
                {error : 'Invalid or missing workspace ID'},
                {status : 404},
            );
        };

        //user update
        await User.updateMany(
            { _id : {$in : body.data}},
            { $push : { otherWorkspaces : workspaceId }},
        );

        return NextResponse.json({ data : updatedWorkspace.members })
    }
    catch(error : unknown){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        );
    };
}