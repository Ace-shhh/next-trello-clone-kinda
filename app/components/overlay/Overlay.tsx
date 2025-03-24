'use client';
import styles from './Overlay.module.scss';
export default function Overlay({children, onClick} : {children : React.ReactNode, onClick: (e : React.MouseEvent<HTMLDivElement>) => void}){

    return(
        <div className={styles.container} onClick={onClick}>
            {children}  
        </div>
        );
};