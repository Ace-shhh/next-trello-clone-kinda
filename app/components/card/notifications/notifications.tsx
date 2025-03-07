import styles from './notifications.module.scss';
import { useState, useEffect } from 'react';
import { updateCardNotification } from '@/services/cardService';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
export default function Notifications(){
    const { cardInfo } = useBoardState();
    const { setCardInfo } = useBoardDispatch()
    if(!cardInfo) return <div>Loading...</div>

    const [isWatching, setIsWatching] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(false);
    const local = localStorage.getItem('userInfo');
    const userInfo = local? JSON.parse(local) : null;

    useEffect(()=>{
        if(!cardInfo.watchers){
            setIsWatching(false);
        }else{
            if(cardInfo.watchers.includes(userInfo._id)){
                setIsWatching(true);
            }
            else{
                setIsWatching(false);
            }
        };
    },[])


    if(!userInfo){
        return <div>Loading...</div>
    }

    async function handleClick(){
        if(!cardInfo) return;

        let updatedWatchers : string[];

        if(!isWatching){
            updatedWatchers = [...cardInfo.watchers ?? [], userInfo._id];
        }else{
            updatedWatchers = cardInfo.watchers.filter(id=> id === userInfo._id? null : id);
        }

        try{
            setLoading(true);
            const updatedCard = await updateCardNotification({id : cardInfo._id, watchers : updatedWatchers});
            setIsWatching(!isWatching);
            setCardInfo(prev=>{
                if(!prev) return prev;
                return {...prev, watchers : updatedCard.watchers}
            })
        }
        catch(error : unknown){
            if(error instanceof CustomError){
                console.log(error.message)
                toast.error('Error updating card notifications. Please try again later');
            }
            else{
                toast.error(String(error));
            };
        }
        finally{
            setLoading(false);
        };
    }

    return(
        <div className={styles.container}>
            <span>Notifications</span>
            <button onClick={handleClick}>
                {loading ? (
                    <div className={styles.spinner}/>
                    ) : 
                    (
                        isWatching ? 'Watching' : 'Watch'
                    )
                }
            </button>
        </div>
    )
}