import Overlay from '../../overlay/Overlay';
import styles from './cardDetails.module.scss';
import { useEffect, useRef, useState } from 'react'
import { useBoardDispatch, useBoardState } from '@/context/boardContext';
import CardTitleEditor from '../cardTitleEditor/cardTitleEditor';
import CardDescriptionEditor from '../descriptionEditor/cardDescriptionEditor';
import Notifications from '../notifications/notifications';
import Activity from '../activity/activity';
import GithubPullRequests from '../githubPullRequests/githubPullRequests';
import { fetchCardInfo } from '@/services/cardService';
import { CustomError } from '@/app/lib/definitions';
import { toast } from 'react-toastify';
import CustomSpinner from '../../loading/CustomSpinner/customSpinner';
import { FiGitPullRequest } from "react-icons/fi";

export default function CardDetails({id} : {id : string}){
    const [showPr, setShowPr] = useState<boolean>(false);
    const { setCardInfo, setSelectedColumn, setSelectedCardId } = useBoardDispatch();
    const { cardInfo } = useBoardState();
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

    function handleShowPr(e : React.ChangeEvent<HTMLInputElement>){
        setShowPr(e.target.checked)
    }
    
    const center = window.innerHeight * 0.5;
    if(!cardInfo) return <Overlay><CustomSpinner size={50} color='white' borderWidth={4} marginTop={center}/></Overlay>

    return (
        <Overlay>
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