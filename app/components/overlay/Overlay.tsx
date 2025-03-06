'use client';
import React from 'react';
import styles from './Overlay.module.scss';
export default function Overlay({children} : {children : React.ReactNode}){

    return(
        <div className={styles.container}>
            {children}  
        </div>
        );
};