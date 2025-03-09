import { NextRequest, NextResponse } from "next/server";
import { Count, Card } from "@/app/lib/models";
import connectToDatabase from "@/app/lib/mongodb";

export async function POST(request : NextRequest){

    const { searchParams} = request.nextUrl;

    const name = searchParams.get('name');

    await connectToDatabase();

    try{
        const newCount = new Count({
            name : name,
            count : 0,
        })

        await newCount.save();

        if(!newCount){
            return NextResponse.json(
                {error : 'Error creating new counter'},
                {status : 400}
            )
        }

        return NextResponse.json(null, {status : 200});
    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    }
}

export async function PATCH(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const webhookId = searchParams.get('webhookId');
    const cardId = searchParams.get('cardId')

    await connectToDatabase();

    try{
        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            {$push : {webhookEvents : webhookId}},
            {new : true},
        );

        if(!updatedCard){
            return NextResponse.json(
                {error : "Cannot find card"},
                {status : 404}
            )
        }

        return NextResponse.json({data : updatedCard})
    }
    catch(error){
        console.log(error)
        return NextResponse.json(
            {error : "Internal server error"},
            {status : 500}
        )
    }
}