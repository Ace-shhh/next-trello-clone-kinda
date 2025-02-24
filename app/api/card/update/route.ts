import { NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/app/lib/mongodb"
import { Card } from "@/app/lib/models";


export async function POST(request : NextRequest){
    const { searchParams } = request.nextUrl
    const id = searchParams.get('id');
    const data = await request.json();

    await connectToDatabase();
    
    try{
        const updatedCard = await Card.findByIdAndUpdate(
            id,
            data,
            {new : true},
        );

        if(!updatedCard){
            return NextResponse.json(
                {error : 'Invalid or missing card id'},
                {status : 404},
            );
        };

        return NextResponse.json({data : updatedCard})
    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {error : 'Internal server error.'},
            {status : 500}
        )
    }
}