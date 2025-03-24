import { NextRequest, NextResponse } from "next/server";
import { Card, Comment } from "@/app/lib/models";
import connectToDatabase from "@/app/lib/mongodb";

export async function GET(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const cardId = searchParams.get('cardId');

    if(!cardId){
        return NextResponse.json({message : 'missing card Id'}, { status : 201 });
    };

    connectToDatabase();

    try{
        const foundCard = await Card.findById(cardId);

        if(!foundCard){
            return NextResponse.json({message : 'Cannot find card'}, {status : 404});
        }

        const promises = foundCard.comments.map(com=>
            Comment.findByIdAndDelete(com)
        );

        const deleteResult = await Promise.all(promises);

        const failedDeletions = deleteResult.filter(result=> result === null);

        const updatedCard = await Card.findByIdAndUpdate(cardId,
            {comments : []},
            {new : true}
        );

        if(!updatedCard){
            return NextResponse.json({message : 'Cannot update card comments'}, {status : 404});
        };

        return NextResponse.json({data : updatedCard, failedDeletions : failedDeletions});

    }
    catch(error){
        console.log(error);
        return NextResponse.json({message : 'Failed'}, {status : 500})
    }

}