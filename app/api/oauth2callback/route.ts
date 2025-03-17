import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/app/lib/models';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/mongodb';
const jwtSecret = process.env.JWT_SECRET as string;

export async function GET(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const error = searchParams.get('error');
    
    if(error){
        return NextResponse.json({error : 'Error logging in using gmail'}, { status : 400 });
    };

    const code = searchParams.get('code');

    if(!code){
        return NextResponse.json({error : 'Missing Code'}, { status : 400 })
    }

    const authUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_VERCEL_URL as string : process.env.NEXT_PUBLIC_AUTH_URL as string;

    try{    
        const response = await fetch(`https://oauth2.googleapis.com/token`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body : new URLSearchParams({
                code : code,
                client_id : process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
                client_secret : process.env.GOOGLE_CLIENT_SECRET ?? '',
                redirect_uri : `${authUrl}/api/oauth2callback`,
                grant_type : 'authorization_code',
            })
        });

        const json = await response.json();

        if(!response.ok){
            return NextResponse.json({ error : json }, { status : response.status });
        };

        const { access_token } = json;

        if(access_token){
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{
                headers : {
                    Authorization : `Bearer ${access_token}`,
                },
            });

            const userInfo = await userInfoResponse.json();

            if(!userInfoResponse.ok){
                console.log('userInfo request not okay')
            }

            connectToDatabase();

            const gmailUser = await User.findOneAndUpdate(
                { email : userInfo.email},
                { 
                    profilePicture : userInfo.picture,
                    username : userInfo.name,
                    password : '',
                    googleId : userInfo.sub,
                },
                { upsert : true, new : true },
            )

            if(!gmailUser){
                return NextResponse.json(
                    {message : 'Error creating new account using gmail'},
                    {status : 400},
                );
            };

            const userData = { userId : gmailUser._id, email : gmailUser.email, googleId : gmailUser.googleId };

            const token = jwt.sign(userData, jwtSecret, { expiresIn : '2h'});

            const redirectUrl = new URL('/login/google', request.url);
            const response = NextResponse.redirect(redirectUrl);

            response.cookies.set('token', token, {
                httpOnly : true,
                secure : process.env.NODE_ENV === 'production',
                path : '/',
                maxAge : 7200,
                sameSite : 'strict',
            });
        
            return response;
        }else{
            console.log('no access token given')
        }
    }
    catch(error){
        console.log(error);
        return NextResponse.json(null, {status : 500})
    }
}