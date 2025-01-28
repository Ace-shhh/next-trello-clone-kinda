import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import {User, Workspace} from '@/app/lib/models';


export async function POST(request : NextRequest){
    const body = await request.json();
    const {email, password} = body;

    await connectToDatabase();

    try{
        
        const user = await User.findOne({email}).populate([
            { path : 'ownWorkspaces', populate : 'boards'},
            { path : 'otherWorkspaces', populate: 'boards'},
        ])

        if(!user){
            return NextResponse.json(
                {error: 'User does not exist'},
                {status : 404}
            )
        }
        return NextResponse.json({data : user})
    }
    catch(error){
        console.log(error)
        NextResponse.json(
            {message : 'Internal server error'},
            {status: 500}
        )
    }
}