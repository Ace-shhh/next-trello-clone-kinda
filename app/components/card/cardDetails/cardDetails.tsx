import Overlay from '../../overlay/Overlay';
import styles from './cardDetails.module.scss';
import { useEffect, useRef, useState, useCallback } from 'react'
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import CardTitleEditor from '../cardTitleEditor/cardTitleEditor';
import CardDescriptionEditor from '../descriptionEditor/cardDescriptionEditor';
import Notifications from '../notifications/notifications';
import Activity from '../activity/activity';
import GithubPullRequests from '../githubPullRequests/githubPullRequests';
import { fetchCardInfo } from '@/services/cardService';
import { ICard, CustomError, IComment } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import CustomSpinner from '../../loading/CustomSpinner/customSpinner';
import { FiGitPullRequest } from "react-icons/fi";
import useCardSubscription from '@/app/hooks/useCardSubscription';

interface CardEventType{
    action : string;
    data : ICard;
    newComment? : IComment;
};

export default function CardDetails({cardId} : {cardId : string}){
    const [showPr, setShowPr] = useState<boolean>(false);
    const { setCardInfo, setSelectedColumn, setSelectedCardId } = useBoardDispatch();
    const { cardInfo } = useBoardState();
    const detailsRef = useRef<HTMLDivElement | null>(null);

    const CardHandler = useCallback((event : CardEventType)=>{
        if(event.action === 'comment'){
            console.log('comment event action handled')
            setCardInfo(prev=>{
                if(!prev || !event.newComment) return prev;
                return {...prev, comments : [event.newComment, ...prev.comments]}
            })
        }
    },[]);

    useCardSubscription(cardId, CardHandler);

    function handleOverlayClick(e : React.MouseEvent<HTMLDivElement>){
        if(e.target === e.currentTarget){
            setCardInfo(null);
            setSelectedColumn(null);
            setSelectedCardId(null);
        };
    };
    
    useEffect(()=>{
        async function fetchInfo(){
            try{
                const result = await fetchCardInfo(cardId);
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

    function handleShowPr(e : React.ChangeEvent<HTMLInputElement>){
        setShowPr(e.target.checked)
    }
    
    const center = window.innerHeight * 0.5;

    if(!cardInfo) return <Overlay><CustomSpinner size={50} color='white' borderWidth={4} marginTop={center}/></Overlay>

    return (
        <Overlay onClick={handleOverlayClick}>
            <div className={styles.container} ref={detailsRef}>
                <CardTitleEditor/>
                <div className={styles.wrapper}>
                    <div className={styles.details}>
                        <Notifications/>
                        <CardDescriptionEditor/>
                        {showPr && <GithubPullRequests/>}
                        <Activity/>
                    </div>
                    <div className={styles.options}>
                        <label>
                            <FiGitPullRequest size={20} className={styles.icon}/> 
                            Show PRs 
                            <input type='checkbox' checked={showPr} onChange={handleShowPr}/>
                        </label>
                    </div>
                </div>
            </div>
        </Overlay>
    );
};