import { NextRequest, NextResponse } from "next/server";
import { Workspace } from "@/app/lib/models";
import { User } from "@/app/lib/models";
import connectToDatabase from "@/app/lib/mongodb";
export async function POST(request : NextRequest){
    const {name, description, userId} = await request.json();

    await connectToDatabase();

    try{
        function getRandomColor(){
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 30) + 20;
            const lightness = Math.floor(Math.random() * 35) + 50;
            return { hue : hue, saturation : saturation, lightness : lightness};
        };


        const newWorkspace = new Workspace(
            {
                name : name,
                description: description,
                members: [
                    { 
                        role : 'owner',
                        userId : userId,
                    }
                ],
                color : getRandomColor(),
            }
        );

        await newWorkspace.save();

        if(!newWorkspace){
            return NextResponse.json(
                {message : 'Error creating new workspace'},
                {status : 400}
            )
        }

        try{   
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {$push : { ownWorkspaces : newWorkspace._id}},
                {new : true}
            ).populate([
                {path : 'ownWorkspaces', populate : 'boards'},
                {path : 'otherWorkspaces', populate : 'boards'}
            ])

            if(!updatedUser){
                return NextResponse.json(
                    {message : 'User not found/Unauthorized'},
                    {status : 404}
                )
            }

            return NextResponse.json({data : newWorkspace})
        }

        catch(error){
            console.log(error)
            return NextResponse.json(
                {message : 'Internal server Error'},
                {status : 500}
            )
        }

    }   
    catch(error){
        console.log(error);
        return NextResponse.json(
            {message : 'Internal server Error'},
            {status: 500}
        )
    }
}