import styles from './column.module.scss';
import { IColumn } from '@/app/lib/definitions';
import AddCard from './addCard/addCard';
import TitleEditor from './titleEditor/titleEditor';
import Card from '../card/card';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import ColumnMenu from './columnMenu/columnMenu';

export default function Column({data, overlay} : {data : IColumn, overlay : boolean | null}){
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id : `column-${data._id}`});

    const style = {
        transform : CSS.Translate.toString(transform),
        transition
    };

    return(
        <div className={`${styles.container} ${overlay? styles.overlay : null} ${isDragging? styles.dragging : null}`} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className={`${isDragging? styles.hidden : null}`}>
                <div className={styles.columnHeader}>
                    <TitleEditor columnId={data._id} title={data.title}/>
                    <ColumnMenu columnId={data._id}/>
                </div>
                <div>
                    <SortableContext strategy={verticalListSortingStrategy} items={data.cards.map((card)=> `card-${card._id}`)}>
                        {data.cards.map((card)=><Card key={card._id} data={card} overlay={overlay} columnInfo={data}/>)}
                    </SortableContext>
                </div>
                <AddCard columnId={data._id} overlay={overlay}/>
            </div>
        </div>
    );
};