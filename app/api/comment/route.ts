import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Comment, Card } from "@/app/lib/models";

export async function POST(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const cardId = searchParams.get('cardId');
    const userId = searchParams.get('userId')
    const body = await request.json();

    await connectToDatabase();
    
    try{
        const newComment = new Comment({
            comment : body.comment,
            user : userId,
        });

        (await newComment.save()).populate('user');

        if(!newComment){
            return NextResponse.json(
                {error : 'Error creating new comment'},
                {status : 400}
            )
        }

        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            {$push : {comments : newComment._id}},
            {new : true},
        );

        if(!updatedCard){
            return NextResponse.json(
                {error : 'Error connecting new comment to card'},
                {status : 400}
            );
        };

        console.log('New Comment : ', newComment)

        return NextResponse.json({data : newComment})
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        );
    };
}