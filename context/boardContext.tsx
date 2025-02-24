'use client'
import type {ReactNode} from 'react';
import { createContext, useContext, useState } from 'react';
import { IBoard, IColumn, ICard } from '@/app/lib/definitions';

interface BoardContextType{
    boardInfo? : IBoard | null;
    setBoardInfo : React.Dispatch<React.SetStateAction<IBoard | null>>;
    selectedColumn? : IColumn | null;
    setSelectedColumn : React.Dispatch<React.SetStateAction<IColumn | null>>;
    cardInfo : ICard | null;
    setCardInfo : React.Dispatch<React.SetStateAction<ICard | null>>;
    selectedCardId : string | null;
    setSelectedCardId : React.Dispatch<React.SetStateAction<string | null>>;
}

const BoardContext = createContext<BoardContextType | null>(null);

export function useBoardContext(){
    const context = useContext(BoardContext);

    if(!context){
        throw new Error('useBoard context must be used inside BoardContextProvider');
    };

    return context;
}

export default function BoardContextProvider({children} : {children : ReactNode}){
    const [boardInfo, setBoardInfo] = useState<IBoard | null>(null);
    const [selectedColumn, setSelectedColumn] = useState<IColumn | null>(null);
    const [cardInfo, setCardInfo] = useState<ICard | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    return(
        <BoardContext.Provider value={{boardInfo, setBoardInfo, selectedColumn, setSelectedColumn, cardInfo, setCardInfo, selectedCardId ,setSelectedCardId}}>
            {children}
        </BoardContext.Provider>
    )
}