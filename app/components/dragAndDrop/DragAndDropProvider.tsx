'use client'
import { 
    closestCorners, 
    DndContext, 
    KeyboardSensor, 
    MouseSensor, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    DragOverlay,
    DragEndEvent,
} from "@dnd-kit/core"
import { horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable"
import React, { ReactNode, useState } from "react"
import { useBoardContext } from '@/context/boardContext';

export default function DragAndDropProvider({ items, children} : {items : string[], children : ReactNode}){
    const [activeId, setActiveId] = useState<string | null | number>(null);
    const { boardInfo, setBoardInfo} = useBoardContext();

    const sensor = useSensors(
        useSensor(MouseSensor),
        useSensor(KeyboardSensor ,{
            coordinateGetter : sortableKeyboardCoordinates
        }),
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            }
        }),
    );

    function handleDragEnd(event : DragEndEvent){
        const { active, over } = event;
        if(!over || active.id === over.id) return;

        

        setBoardInfo((prev)=>{
            if(!prev) return prev;
            const currentColumns = [...prev.columns];
            const oldIndex = currentColumns.findIndex((col)=> col._id === active.id);
            const newIndex = currentColumns.findIndex((col)=> col._id === over.id);
            const updatedColumns = arrayMove(currentColumns, oldIndex, newIndex);
            return {...prev, columns : updatedColumns};
        })
    }

    return(
        <DndContext 
            sensors={sensor} 
            collisionDetection={closestCorners} 
            onDragEnd={handleDragEnd}
            >
            <SortableContext items={items || []} strategy={horizontalListSortingStrategy}>
                {children}
            </SortableContext>
            <DragOverlay>
                {activeId ? (
                    <div style={{ 
                        backgroundColor: 'lightgray', 
                        padding: '10px', 
                        border: '1px solid black' 
                    }}>
                        Dragging: {activeId}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}