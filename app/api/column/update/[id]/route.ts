export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import { Column } from "@/app/lib/models";

interface RouteContext {
    params: {
      id: string;
    };
    [key: string]: unknown;
  }


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