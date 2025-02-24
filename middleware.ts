import {NextResponse, NextRequest} from 'next/server';
import { jwtVerify } from 'jose';


export async function middleware(req : NextRequest){
    const token = req.cookies.get('token')?.value;
   
    if(!token){
        return NextResponse.json(
            { error : 'Authentication required. No token provided'},
            { status : 401}
        );
    }

    try{
        const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
        await jwtVerify(token, secret);
        return NextResponse.next();
    }
    catch(error : unknown){
        console.error('JWT verification error : ', error)
        return NextResponse.json(
            { error : "Authentication required. Invalid or expired token" },
            { status : 401 }
        )
    }    
}


export const config = {
    matcher : [
        '/api/board/:path*',
        '/api/workspace/:path*'
    ]
}
