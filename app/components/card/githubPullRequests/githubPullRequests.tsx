import styles from './githubPullRequests.module.scss';
import { FiGitPullRequest } from "react-icons/fi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useBoardState } from '@/context/boardContext';
import Link from 'next/link';

export default function GithubPullRequests(){
    const { cardInfo } = useBoardState();
    
    if(!cardInfo) return <div>Loading..</div>

    return(
        <div className={styles.container}>
            <FiGitPullRequest size={25} className={styles.icon}/>
            <span className={styles.headerSpan}>GitHub pull requests</span>
            <div className={styles.requestWrapper}>
                {cardInfo.webhookEvents.map(we=>{
                    return(
                        <div key={we._id} className={styles.requestCtn}>
                            <div className={styles.head}>
                                <h3>{we.title}</h3>
                                <span className={`${styles.stateSpan} ${we.state === 'open' ? styles.open : styles.closed}`}>{we.state}</span>
                            </div>
                            <span className={styles.author}>Author : {we.author}</span>

                            <Link 
                                className={styles.prLink}
                                href={we.githubLink}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <FaExternalLinkAlt size={10} className={styles.linkIcon}/>
                                {we.githubLink}
                            </Link>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}