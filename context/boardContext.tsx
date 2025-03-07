'use client'
import type {ReactNode} from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { IBoard, IColumn, ICard } from '@/app/lib/definitions';

interface BoardStateContextType{
    boardInfo? : IBoard | null;
    selectedColumn? : IColumn | null;
    cardInfo : ICard | null;
    selectedCardId : string | null;
}

interface BoardStateDispatchType{
    setBoardInfo : React.Dispatch<React.SetStateAction<IBoard | null>>;
    setSelectedColumn : React.Dispatch<React.SetStateAction<IColumn | null>>;
    setCardInfo : React.Dispatch<React.SetStateAction<ICard | null>>;
    setSelectedCardId : React.Dispatch<React.SetStateAction<string | null>>;
}

const BoardStateContext = createContext<BoardStateContextType | undefined>(undefined);
const BoardDispatchContext = createContext<BoardStateDispatchType | undefined>(undefined);

export function useBoardState(){
    const context = useContext(BoardStateContext);

    if(context === undefined){
        throw new Error('useBoardState context must be used inside BoardContextProvider');
    };

    return context;
}

export function useBoardDispatch(){
    const context = useContext(BoardDispatchContext);
    if(context === undefined){
        throw new Error('useBoardDispatch context must be used inside BoardContextProvider');
    };

    return context;
};

export default function BoardContextProvider({children} : {children : ReactNode}){
    const [boardInfo, setBoardInfo] = useState<IBoard | null>(null);
    const [selectedColumn, setSelectedColumn] = useState<IColumn | null>(null);
    const [cardInfo, setCardInfo] = useState<ICard | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    const dispatchValue = useMemo(()=>({
        setBoardInfo,
        setSelectedColumn,
        setCardInfo,
        setSelectedCardId
    }),[setBoardInfo, setSelectedColumn, setCardInfo, setSelectedCardId])



    return(
        <BoardDispatchContext.Provider value={dispatchValue}>
        <BoardStateContext.Provider value={{boardInfo, selectedColumn, cardInfo,  selectedCardId}}>
            {children}
        </BoardStateContext.Provider>
        </BoardDispatchContext.Provider>
    )
}