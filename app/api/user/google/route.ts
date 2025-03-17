import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/app/lib/models';
import connectToDatabase from '@/app/lib/mongodb';
import jwt, {JwtPayload} from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET as string;

interface myJwtPayload extends JwtPayload{
    userId : string;
    email : string;
    googleId : string;
};

function isMyJwtPayload(obj : any) : obj is myJwtPayload{
    return(
        obj &&
        typeof obj === 'object' &&
        typeof obj.userId === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.googleId === 'string'
    );
};

export async function GET(request : NextRequest){
    
    const token = request.cookies.get('token')?.value;

    if(!token){
        return NextResponse.json(
            { message : 'Not authenticated'},
            { status : 401}
        );
    };
    
    try{
        const decoded = jwt.verify(token, jwtSecret);
        
        if(!isMyJwtPayload(decoded)){
            return NextResponse.json(
                {message : 'Invalid token payload'},
                {status : 401},
            );
        };

        const {userId, email, googleId} = decoded;

        const user = await User.findOne({
            email : email,
            _id : userId,
            googleId : googleId
        }).populate([{path : 'ownWorkspaces', populate : 'boards'}, { path : 'otherWorkspaces', populate : 'boards'}])
        
        if(!user){
            return NextResponse.json(
                {message : 'User not found'},
                {status : 404},
            );
        };

        return NextResponse.json({ data : user});
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { message : 'Internal server error' },
            { status : 500}
        )
    }
}