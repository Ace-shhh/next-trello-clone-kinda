'use client'
import { useContext, createContext, useState, ReactNode } from 'react';
import { ICard } from '@/app/lib/definitions';

interface CardContextType{
    cardInfo : ICard | null;
    setCardInfo : React.Dispatch<React.SetStateAction<ICard | null>>;
}

const CardContext = createContext<CardContextType | null>(null);

export function useCardContext(){
    const context = useContext(CardContext);
    if(!context){
        throw new Error('useCardContext must be used inside CardContextProvider')
    };

    return context;
}

export function CardContextProvider({children} : {children : ReactNode}){
    const [cardInfo, setCardInfo] = useState<ICard | null>(null)    
    
    return(
        <CardContext.Provider value={{cardInfo, setCardInfo}}>
            {children}
        </CardContext.Provider>
    )
}