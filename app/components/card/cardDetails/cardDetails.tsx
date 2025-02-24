import Overlay from '../../overlay/Overlay';
import styles from './cardDetails.module.scss';
import { useEffect, useRef, useState } from 'react'
import { useBoardContext } from '@/context/boardContext';
import CardTitleEditor from '../cardTitleEditor/cardTitleEditor';
import CardDescriptionEditor from '../descriptionEditor/cardDescriptionEditor';
import Notifications from '../notifications/notifications';
import Activity from '../activity/activity';
import { fetchCardInfo } from '@/services/cardService';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';

export default function CardDetails({id} : {id : string}){
    const { setCardInfo, setSelectedColumn, cardInfo, setSelectedCardId } = useBoardContext();
    const detailsRef = useRef<HTMLDivElement | null>(null);


    useEffect(()=>{
        function handleClickOutside(e : MouseEvent){
            if(detailsRef.current && !detailsRef.current.contains(e.target as Node)){
                setCardInfo(null);
                setSelectedColumn(null);
                setSelectedCardId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[]);
    
    useEffect(()=>{
        async function fetchInfo(){
            try{
                const result = await fetchCardInfo(id);
                setCardInfo(result);
            }
            catch(error : unknown){
                if(error instanceof CustomError){
                    toast.error(error.message, {autoClose : 5000});
                }
                else{
                    toast.error(String(error), {autoClose : 5000})
                }
                setCardInfo(null);
            }
        }
        
        fetchInfo();
    },[]);
    
    if(!cardInfo) return <div>Loading...</div>

    return (
        <Overlay>
            <div className={styles.container} ref={detailsRef}>
                <CardTitleEditor/>
                <Notifications/>
                <CardDescriptionEditor/>
                <Activity/>
            </div>
        </Overlay>
    );
};