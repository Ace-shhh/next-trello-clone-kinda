'use client'
import styles from './workspace.module.scss';
import { IWorkspace, IBoard } from '@/app/lib/definitions';
import AddBoard from '../addBoard/addBoard';
import AddMember from '../addMember/addMember';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import Link from 'next/link';
import { useRef, useEffect } from 'react';

export default function Workspace({data, role}: {data : IWorkspace, role : string}){
    const headerRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(()=>{
        if(!data.color) return;
        
        const { hue, saturation, lightness} = data.color;

        if(headerRef.current){
            headerRef.current.style.backgroundImage = 
            `linear-gradient( to left, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${hue + 20}, ${lightness}%, ${saturation}%))`;
        }
    },[]);


    return(
        <div className={styles.container}>
            <div className={styles.header} ref={headerRef}>
                <h2>{data.name}</h2>
                <div className={styles.boardInformation}>
                    <span><GoPeople size={15} className={styles.icon}/> {data.members.length} Members</span>
                </div>
            </div>
            <div className={styles.boards_container}>
                {data.boards.map((board : IBoard)=>
                <Link href={`/board/${board._id}?wsId=${data._id}&role=${role}`} key={board._id} className={styles.board}>
                    {board.title}
                    <MdOutlineKeyboardArrowRight size={20}/>
                </Link>
                )}
                <AddBoard workspaceId={data._id}/>
            </div>
            <div className={styles.addMemberCtn}>
                <AddMember workspaceData={data}/>
            </div>
        </div>
    )
}