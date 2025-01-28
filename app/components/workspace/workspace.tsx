'use client'
import styles from './workspace.module.scss';
import { IWorkspace, Board } from '@/app/lib/definitions';
import Link from 'next/link'

export default function Workspace({data}: {data : IWorkspace}){
    return(
        <div className={styles.container}>
            <h2>{data.name}</h2>
            <div className={styles.boards_container}>
                {data.boards.map((board : Board)=>
                <Link href={`/board/${board._id}`} key={board._id} className={styles.board}>
                    {board.title}
                </Link>
                )}
            </div>
        </div>
    )
}