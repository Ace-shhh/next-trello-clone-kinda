'use client'
import styles from './workspace.module.scss';
import { IWorkspace, IBoard } from '@/app/lib/definitions';
import AddBoard from '../addBoard/addBoard';
import AddMember from '../addMember/addMember';
import Link from 'next/link'

export default function Workspace({data, role}: {data : IWorkspace, role : string}){
    
    return(
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <h2>{data.name}</h2>
                <AddMember workspaceData={data}/>
            </div>
            <div className={styles.boards_container}>
                {data.boards.map((board : IBoard)=>
                <Link href={`/board/${board._id}?wsId=${data._id}&role=${role}`} key={board._id} className={styles.board}>
                    {board.title}
                </Link>
                )}
                <AddBoard workspaceId={data._id}/>
            </div>
        </div>
    )
}