export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Column, Board } from "@/app/lib/models";

export async function PATCH(request: NextRequest, { params }: { params : Promise<{ id : string }> }){
    const body = await request.json();
    const data = body;
    const { id } = await params;

    await connectToDatabase();

    try{
        const updatedColumn = await Column.findByIdAndUpdate(
            id,
            data,
            {new : true},
        )

        if(!updatedColumn){
            return NextResponse.json(
                { error : 'Column not found'},
                { status : 404 },
            );
        };

        return NextResponse.json({data : updatedColumn});
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            { error : "Internal server error"},
            { status : 500 },
        );
    };
}

export async function PUT(request : NextRequest, { params } : {params : Promise<{ id : string}>}){
    const data = await request.json();
    const { id } = await params;

    await connectToDatabase();

    try{
        const updatedColumn = await Column.findByIdAndUpdate(
            id,
            { cards : data}
        );

        if(!updatedColumn){
            return NextResponse.json(
                { error : `Column not found with id : ${id}`}, 
                { status : 404 }
            )
        }

        return NextResponse.json(id);
    }   
    catch(error){
        console.log(error)
        return NextResponse.json(
            { error : 'Internal server error'},
            { status : 500}
        )
    }
}