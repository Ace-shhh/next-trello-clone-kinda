import { NextRequest, NextResponse } from 'next/server';
import { Card, Column } from '@/app/lib/models';
import connectToDatabase from '@/app/lib/mongodb';

export async function POST(request : NextRequest){
    const body = await request.json();
    const { title, columnId } = body;
    
    await connectToDatabase();

    try{
        const newCard = new Card({title : title});

        await newCard.save();

        if(!newCard){
            return NextResponse.json(
                {error : 'Error creating new Card'},
                {status : 500}
            );
        };

        try{
            const updatedColumn = await Column.findByIdAndUpdate(
                columnId,
                {$push : {cards : newCard}},
                {new : true},
            );

            if(!updatedColumn){
                return NextResponse.json(
                    {error : "Error linking card to column. Column not found"},
                    {status : 404}
                );
            };

            return NextResponse.json({data : newCard});
        
        }
        catch(error){
            console.log(error);
            return NextResponse.json(
                {error : `Error linking card to column. CardId = , ${newCard._id}`}
            );
        };
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error : "Internal server error"},
            {status: 500}
        );
    };
};

export async function GET(request : NextRequest){
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    await connectToDatabase();

    try{
        const fetchedCard = await Card.findById(id).populate({path : 'comments', options : { sort : { createdAt : -1 }}, populate : 'user'});

        if(!fetchedCard){
            return NextResponse.json(
                { error : 'Card id not found. Missing or invalid' },
                { status : 404 }
            );
        }

        return NextResponse.json({ data : fetchedCard})
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { error : 'Internal server error.' },
            {status : 500 }
        )
    }
}