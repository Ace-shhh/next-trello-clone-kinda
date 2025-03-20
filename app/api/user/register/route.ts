import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import { User } from '@/app/lib/models';

export async function POST(request : NextRequest){
    const body = await request.json();

    await connectToDatabase();

    try{
        const newUser = new User(body);

        await newUser.save();

        if(!newUser){
            return NextResponse.json(
                {message : 'Failed to create new user'},
                {status : 400}
            );
        };

        return NextResponse.json({data : newUser});
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    }
}   