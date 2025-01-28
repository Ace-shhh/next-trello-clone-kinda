import styles from './card.module.scss';
import { ICard } from '@/app/lib/definitions';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
export default function Card({data} : {data : ICard}){
    const { attributes, listeners, setNodeRef, transform, transition} = useSortable({id : data._id})
        const style = {
            transform : CSS.Translate.toString(transform),
        }

    return(
        <div className={styles.card} ref={setNodeRef} {...attributes} {...listeners} style={style}>
            {data.title}
        </div>
    )
}