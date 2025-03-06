import { NextRequest, NextResponse } from 'next/server';

export async function POST(request : NextRequest){
    const response = NextResponse.json({message : 'Logged out'});

    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        expires: new Date(0),
    })

    return response;
}