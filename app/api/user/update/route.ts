import { NextResponse, NextRequest } from "next/server";
import { User } from '@/app/lib/models';
import connectToDatabase from "@/app/lib/mongodb";
import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

interface UpdatedData{
    username? : string;
    email? : string;
    profilePicture? : string;
}

export async function POST(request : NextRequest){
    console.log('User update route fired')
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    const formData = await request.formData();

    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const profilePicture = formData.get('profilePicture');

    const updatedData : UpdatedData = {};

    if(username && typeof username === "string"){
        updatedData.username = username;
    };

    if(email && typeof email === "string"){
        updatedData.email = email;
    };

    if(!password || typeof password !== 'string'){
        return NextResponse.json(
            {error : 'No valid password provided'},
            {status : 404},
        );
    };


    await connectToDatabase();

    cloudinary.config({ 
        cloud_name: 'dgx3t1f3n', 
        api_key: '244899175352848', 
        api_secret: process.env.CLOUDINARY_SECRET
    });

    if(profilePicture){
        if(profilePicture instanceof File){
            try{
                console.log('File upload working')
                const arrayBuffer = await profilePicture.arrayBuffer();
                const bufferData = Buffer.from(arrayBuffer);

                const uploadResult = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({},(error, result)=> {
                        if(error){
                            return reject(error);
                        };
                        resolve(result);
                    });

                    const bufferStream = new stream.PassThrough();
                    bufferStream.end(bufferData);
                    bufferStream.pipe(uploadStream)
                });
                updatedData.profilePicture = uploadResult.secure_url;
            }
            catch(uploadError){
                console.log("Cloudinary upload error : ", uploadError);
                return NextResponse.json(
                    {error : 'Failed to upload image'},
                    {status : 500}
                );
            };
        }
    }


    try{
        const user = await User.findById(id).select('+password');
        if(!user){
            return NextResponse.json(
                {error : 'Invalid or missing user id'},
                {status : 404},
            );
        };
        
        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return NextResponse.json(
                {error : "Invalid password"},
                {status : 401},
            );
        };

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updatedData,
            {new : true},
        ).populate([
            { path : 'ownWorkspaces', populate : 'boards'},
            { path : 'otherWorkspaces', populate: 'boards'},
        ]);

        return NextResponse.json({data : updatedUser});
    }
    catch(error : unknown){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    }
}