import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET as string;

import { User } from '@/app/lib/models';


export async function POST(request : NextRequest){
    const body = await request.json();
    const {email, password} = body;

    await connectToDatabase();

    if(!email || !password) return;

    try{
        const user = await User.findOne({email}).populate([
            { path : 'ownWorkspaces', populate : 'boards'},
            { path : 'otherWorkspaces', populate: 'boards'},
        ]).select('+password')

        if(!user){
            return NextResponse.json(
                {error: 'User does not exist'},
                {status : 404}
            )
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return NextResponse.json(
                {message : 'Invalid Credentials'},
                {status : 401},
            );
        };

        const userData = {userId : user._id, email : user.email};

        const token = jwt.sign(userData, jwtSecret, {expiresIn : '2h'});
        user.password = '';
        const response = NextResponse.json({data : user});

        response.cookies.set('token' , token, {
            httpOnly: true,
            secure : process.env.NODE_ENV === 'production',
            path : '/',
            maxAge : 7200,
            sameSite : 'strict',
        })

        return response;
    }
    catch(error){
        console.log(error)
        NextResponse.json(
            {message : 'Internal server error'},
            {status: 500}
        )
    }
}

export async function PATCH(request : NextRequest){
    const {fieldsToUpdate, userId} = await request.json();
    
    try{
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            ...fieldsToUpdate,
            {new : true},
        );

        if(!updatedUser){
            return NextResponse.json(
                {message : 'User not found'},
                {status : 404}
            );
        };

        return NextResponse.json(updatedUser)
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {message : 'Internal server error'},
            {status :  500}
        )
    }
}

export async function GET(){

    await connectToDatabase();

    try{    
        const fetchedUsers = await User.find({});

        if(!fetchedUsers){
            return NextResponse.json(
                {error : 'Error fetching users'},
                {status : 400}
            );
        };

        return NextResponse.json({data : fetchedUsers});
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    }
}