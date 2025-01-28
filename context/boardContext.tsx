'use client'
import type {ReactNode} from 'react';
import { createContext, useContext, useState } from 'react';
import { IBoard } from '@/app/lib/definitions';

interface BoardContextType{
    boardInfo? : IBoard | null;
    setBoardInfo : React.Dispatch<React.SetStateAction<IBoard | null>>
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


    return(
        <BoardContext.Provider value={{boardInfo, setBoardInfo}}>
            {children}
        </BoardContext.Provider>
    )
}