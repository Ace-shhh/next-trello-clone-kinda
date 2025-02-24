import { IBoard, IColumn, ICard } from "../lib/definitions";
import { arrayMove } from "@dnd-kit/sortable";

type DndHelperParams={
    activeId : string;
    overId? : string | null;
    activeColumnId? : string | null;
    overColumnId? : string | null;
    columnId? : string| null;
    boardInfo? : IBoard | null;
    columns? : IColumn[] | null;
}

export function getDragInfo(id : string, columns : IColumn[]){
    if(id.startsWith('column-')){
        const originalId = id.replace('column-', '');
        return {id : originalId, type : 'column', columnId : originalId};
    }
    else{
        const originalId = id.replace('card-', '');

        const columnInfo = columns.find((col)=>
            col.cards.some((card)=> card._id === originalId)
        )

        if (!columnInfo) {
            throw new Error(`Card with id ${originalId} not found in any column.`);
        }

        return {id : originalId, type : 'card', columnId : columnInfo._id};
    }
}

export function moveColumns({activeId, overId, boardInfo} : DndHelperParams){
    if(!boardInfo) return;
    let updatedColumns = [...boardInfo.columns];
    
    const oldIndex = updatedColumns.findIndex(col=> col._id === activeId);
    const newIndex = updatedColumns.findIndex(col=> col._id === overId);
    return arrayMove(updatedColumns, oldIndex, newIndex);
}

export function updateCardsWithSameColumn({activeId, overId, columnId, columns} : DndHelperParams){
    if(!columns) return;
    let currentColumn = columns.find(col => col._id === columnId);
    if(!currentColumn) return;
    const oldIndex = currentColumn.cards.findIndex(card => card._id === activeId);
    const newIndex = currentColumn.cards.findIndex(card => card._id === overId);
    const updatedColumns = columns.map(col=> col._id === columnId? {...col, cards : arrayMove(col.cards, oldIndex, newIndex)} : col)
    return updatedColumns;
}

export function moveCardToDifferentColumn({activeId, overId, activeColumnId, overColumnId, boardInfo} : DndHelperParams) : IBoard | null{
    console.log('MoveCardToDifferentColumn fired')
    if(!boardInfo) return null;
    let updatedBoard : IBoard = {...boardInfo};
    let cardToMove: ICard | undefined;

    updatedBoard.columns = updatedBoard.columns.map((col)=> {
        if(col._id === activeColumnId){
            cardToMove = col.cards.find(card=> card._id === activeId);
            const updatedCards = col.cards.filter((card)=> card._id !== activeId);
            return {...col, cards : updatedCards}
        }
        return col
    })

    updatedBoard.columns = updatedBoard.columns.map(col=> {
        if(col._id === overColumnId){
            const updatedCards = cardToMove? [...col.cards, cardToMove] : col.cards;
            const oldIndex = updatedCards.findIndex(card=> card._id === activeId);
            const newIndex = updatedCards.findIndex(card => card._id === overId);
            const sortedCard = arrayMove(updatedCards, oldIndex, newIndex);
            return {...col, cards : sortedCard?  sortedCard : updatedCards};
        };

        return col;
    });

    return updatedBoard;
}