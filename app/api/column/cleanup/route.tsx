import { NextResponse, NextRequest } from 'next/server';
import { Card, Board, Column } from '@/app/lib/models';
import { IBoard } from '@/app/lib/definitions';
export async function GET(){
    try{
        const board = await Board.findById('6791d3791a78cbe44038d103').populate('columns').lean<IBoard>();

        if(!board){
            return NextResponse.json({message : 'cannot find board'}, {status : 404})
        }

        const filteredColumns = board.columns.filter(col=> col.cards.length === 0);
        const remainingColumns = board.columns.filter(col=> col.cards.length > 0).map(col=> col._id);

        await Promise.all(filteredColumns.map(col=> Column.findByIdAndDelete(col._id)));

        await Board.findByIdAndUpdate('6791d3791a78cbe44038d103', {columns : remainingColumns});

        return NextResponse.json(
            {message : 'Columns deletion success', deletedCount : filteredColumns.length},
        ) 

    }
    catch(error){
        console.log(error);
        return NextResponse.json({message : 'Internal server error'}, {status : 500});
    };
}