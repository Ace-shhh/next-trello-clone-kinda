import styles from './customSpinner.module.scss';
import { useRef, useEffect } from 'react';

export default function CustomSpinner({size, color, borderWidth, marginTop} : {size : number, color : string, borderWidth : number, marginTop : number | null}){
    const spinnerRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(()=>{
        if(spinnerRef.current){
            spinnerRef.current.style.borderColor = color;
            spinnerRef.current.style.borderBottomColor = 'transparent';
            spinnerRef.current.style.height = `${size}px`;
            spinnerRef.current.style.width = `${size}px`;
            spinnerRef.current.style.borderWidth = `${borderWidth}px`;
            if(marginTop){
                const adjust = size / 2;
                spinnerRef.current.style.marginTop = `${marginTop - adjust }px`;
            }
        }
    })
    
    return(
        <div className={styles.spinner} ref={spinnerRef}/>
    )
}