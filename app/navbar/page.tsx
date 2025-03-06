'use client'
import styles from './page.module.scss';
import AccountMenu from '../components/navbar/accountMenu/accountMenu';
import { useRouter } from 'next/navigation';

export default function Navbar(){
    const router = useRouter();

    return (
        <div className={styles.container}>
            <h2 onClick={()=> router.push('/workspaces')}>Trello</h2>
            <AccountMenu/>
        </div>
    )
}