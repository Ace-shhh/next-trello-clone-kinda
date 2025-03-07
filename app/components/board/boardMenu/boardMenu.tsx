import styles from './boardMenu.module.scss';
import React from 'react';
import { CgClose } from "react-icons/cg";
import {useState} from 'react';
import { BiArchive } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import DeleteBoard from './deleteBoard/deleteBoard';
import Archive from './archive/archive';

function BoardMenu({onClose} : { onClose : ()=> void}){
    const [show, setShow] = useState<string>('Menu')

    return(
        <div className={styles.container}>
            <button className={styles.closeButton} onClick={()=>onClose()}>
                <CgClose size={20}/>
            </button>
            {
                show !== 'Menu' && <button className={styles.returnButton} onClick={()=>setShow('Menu')}><IoIosArrowBack size={20}/></button>
            }
            <h3>{show}</h3>
            { show === "Menu" && 
            (  
                <div className={styles.buttonsCtn}>
                    <button onClick={()=>setShow('Archive')}><BiArchive className={styles.icon} size={20}/>Archived items</button>
                    <DeleteBoard/>
                </div>
            )}


            { show === "Archive" && <Archive/>}
        </div>
    )   
}

export default React.memo(BoardMenu);