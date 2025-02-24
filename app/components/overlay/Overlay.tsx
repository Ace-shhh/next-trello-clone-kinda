'use client';
import React from 'react';
import styles from './Overlay.module.scss';
export default function Overlay({children, onBackDropClick} : {children : React.ReactNode, onBackDropClick? : ()=> void}){

    return(
        <div className={styles.container}>
            {children}  
        </div>
        );
};