'use client'
import { 
    DndContext, 
    MouseSensor, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    DragOverlay,
    DragOverEvent,
    rectIntersection,
    DragStartEvent,
} from "@dnd-kit/core"

import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import React, { ReactNode, useState, useRef } from "react"
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import { getDragInfo, moveColumns, updateCardsWithSameColumn, moveCardToDifferentColumn } from "@/app/utils/dndHelpers";
import Card from "../card/card";
import Column from "../column/column";
import { ICard, IColumn } from "@/app/lib/definitions";
import { updateColumnCardsOrder } from "@/services/columnService";
import { toast } from "react-toastify";
import { CustomError } from "@/app/lib/definitions";
import { udpateColumnOrder } from "@/services/boardService";


type ActiveDataType={
    id : string,
    type : string,
    columnId : string,
    info? : ICard | IColumn,
}

export default function DragAndDropProvider({ items, children} : {items : string[], children : ReactNode}){
    const [activeData, setActiveData] = useState<ActiveDataType | null>(null);
    const { boardInfo } = useBoardState();
    const { setBoardInfo } = useBoardDispatch();
    const [columnIdsToUpdate, setColumnIdsToUpdate] = useState<string[]>([]);
    const [updateBoard, setUpdateBoard] = useState<boolean>(false);
    const lastUpdateTime = useRef<number>(0)

    const sensor = useSensors(
        useSensor(MouseSensor),
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            }
        }),
    );

    function handleDragEnd(){
        if(!boardInfo) return;
        setTimeout(async function(){
            const now = Date.now();
            if(now - lastUpdateTime.current < 10000) return;
            
            if(columnIdsToUpdate && columnIdsToUpdate.length !== 0){
                try{
                    const updatedColumns = await updateColumnCardsOrder(columnIdsToUpdate, boardInfo.columns);
                    console.log('Updated columns : ', updatedColumns);
                }
                catch(error : unknown){
                    if(error instanceof CustomError){
                        toast.error(error.message, {autoClose : 5000});
                    }else{
                        toast.error(String(error), {autoClose : 5000});
                    };
                }
                finally{
                    setColumnIdsToUpdate([]);
                }
            }

            if(updateBoard){
                try{
                    const updatedBoard = await udpateColumnOrder(boardInfo._id, boardInfo.columns);
                    console.log(updatedBoard)
                }
                catch(error){   
                    if(error instanceof CustomError){
                        toast.error(error.message, {autoClose : 5000});
                    }
                    else{
                        toast.error(String(error), {autoClose : 50001})
                    }
                }
                finally{
                    setUpdateBoard(false);
                }
            }


        }, 10000)
    }

    function handleDragOver(event : DragOverEvent){

        const now = Date.now();
        if (now - lastUpdateTime.current < 50) {
          return;
        }
        lastUpdateTime.current = now;

        const { active, over } = event;
        if(!over || !boardInfo) return;
        const activeData = getDragInfo(active.id.toString(), boardInfo.columns);
        const overData = getDragInfo(over.id.toString(), boardInfo.columns);
        // column to column
        if(activeData.type === 'column' && overData.type === 'column' && activeData.id !== overData.id){
            setBoardInfo((prev)=>{
                if(!prev) return prev;
                const updatedColumns = moveColumns({activeId : activeData.id, overId  : overData.id, boardInfo : prev});
                return {...prev, columns : updatedColumns || []};
            });
            setUpdateBoard(true);
        }
        //card to card same column
        if(activeData.type === 'card' && overData.type === 'card' && activeData.columnId === overData.columnId){
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const updatedColumns = updateCardsWithSameColumn({activeId : activeData.id, overId : overData.id, columnId : activeData.columnId, columns : prev.columns});
                return {...prev, columns : updatedColumns || []};
            });
            if(!columnIdsToUpdate?.includes(activeData.columnId)){
                setColumnIdsToUpdate(prev=> {
                    if(!prev) return prev;
                    return [...prev, activeData.columnId]
                })
            }
        }
        //card to card different column
        if(activeData.type === 'card' && activeData.columnId !== overData.columnId){
            setBoardInfo(prev=>{
                if(!prev) return prev;
                const updatedBoardInfo = moveCardToDifferentColumn({activeId : activeData.id, overId : overData.id, activeColumnId : activeData.columnId, overColumnId : overData.columnId, boardInfo : prev});
                return updatedBoardInfo;
            })
            const arr : string[] = [];
            if(!columnIdsToUpdate?.includes(activeData.columnId)){
                arr.push(activeData.columnId)
            }
            if(!columnIdsToUpdate?.includes(overData.columnId)){
                arr.push(activeData.columnId);
            };

            if(arr.length !== 0){
                setColumnIdsToUpdate(prev => {
                    if(!prev) return prev;
                    return [...prev, ...arr]
                })
            }
        };
    }

    function handleDragStart(event : DragStartEvent){
        if(!boardInfo) return;
        const { active } = event;
        const activeData = getDragInfo(active.id.toString(), boardInfo.columns) as ActiveDataType;

        if(activeData.type === 'card'){
            const foundColumn = boardInfo.columns.find(col => col._id === activeData.columnId);
            if(foundColumn){
                const foundCard = foundColumn.cards.find((card) => card._id === activeData.id)
                activeData.info = foundCard;
            }
            else{
                console.log('no found card')
            }
        }
        else if(activeData.type === 'column'){
            const foundColumn = boardInfo.columns.find(col=> col._id === activeData.id)
            activeData.info = foundColumn;
        };
        setActiveData(activeData);
    };

    return(
        <DndContext 
            sensors={sensor} 
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            >
            <SortableContext items={items || []} strategy={horizontalListSortingStrategy}>
                {children}
            </SortableContext>
            <DragOverlay>
                {
                    activeData && activeData.info && (
                        activeData.type === 'card'? (
                                <Card data={activeData.info as ICard} overlay={true} columnInfo={null}/>
                        ) : (
                            activeData.type === 'column' ? (
                                <Column data={activeData.info as IColumn} overlay={true}/>
                            ) : (null)
                        )
                    
                    )
                }
            </DragOverlay>
        </DndContext>
    )
}