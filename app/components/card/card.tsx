import styles from './card.module.scss';
import { ICard, IColumn } from '@/app/lib/definitions';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { useBoardContext } from '@/context/boardContext';
export default function Card({data, overlay, columnInfo} : {data : ICard, overlay : boolean | null, columnInfo : IColumn | null}){
    const { setSelectedCardId, setSelectedColumn } = useBoardContext();
    
    const { attributes, listeners, setNodeRef, transform, isDragging} = useSortable({id : `card-${data._id}`})
    const style = {
        transform : CSS.Translate.toString(transform),
    }

    function handleClick(e : React.MouseEvent<HTMLDivElement>){
        e.stopPropagation();
        if(!columnInfo) return;
        setSelectedColumn(columnInfo);
        setSelectedCardId(data._id);
    }

    return(
        <div 
            className={`${styles.card} ${overlay? styles.overlay : null} ${isDragging? styles.dragging : null}`} 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style}
            onClick={handleClick}
        >
            <span className={`${isDragging? styles.hidden : null}`}>
                {data.title}
            </span>
        </div>
    )
}