import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Comment, Card } from "@/app/lib/models";
import pusher from "@/app/lib/pusher";
import ActivityLogger from "@/app/lib/activityLogger";

export async function POST(request : NextRequest){
    const body = await request.json();
    const { comment, cardId, userId, socketId } = body;

    const ipAddress = request.headers.get("x-forwaded-for")?.split('')[0].trim() || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent") || "unknown";

    await connectToDatabase();

    try{
        const newComment = new Comment({
            comment : comment,
            user : userId,
        });

        const savedComment = await newComment.save();
        await savedComment.populate('user');

        if(!newComment){
            return NextResponse.json(
                {error : 'Error creating new comment'},
                {status : 400}
            )
        }

        const activityLog = {
            action : 'posted a comment',
            entity : newComment._id,
            in : cardId,
            user : userId,
            metadata : {
                ipAddress,
                userAgent,
            }
        }

        const newActivityId = await ActivityLogger(activityLog);

        const updateQuery: any = { $push : { comments : newComment._id }}

        if(newActivityId){
            updateQuery.$push.activity = newActivityId;
        };

        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            updateQuery,
            {new : true},
        );

        if(!updatedCard){
            return NextResponse.json(
                {error : 'Error connecting new comment to card'},
                {status : 400}
            );
        };
        
        const data = {
            action : 'comment',
            data : updatedCard,
            newComment : savedComment,
        }

        pusher.trigger(cardId, 'CardEvent', data, {
            socket_id : socketId
        });

        return NextResponse.json({data : savedComment})
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        );
    };
}