import styles from './column.module.scss';
import { IColumn } from '@/app/lib/definitions';
import AddCard from './addCard/addCard';
import TitleEditor from './titleEditor/titleEditor';
import Card from '../card/card';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export default function Column({data} : {data : IColumn}){
    const {attributes, listeners, setNodeRef, transform} = useSortable({id : data._id})
    const style = {
        transform : CSS.Translate.toString(transform),
    }
    return(
        <div className={styles.container} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div>
                <TitleEditor columnId={data._id} title={data.title}/>
            </div>
            <div>
                <SortableContext items={data.cards.map((card)=> card._id)}>
                    {data.cards?.map((card)=> <Card key={card._id} data={card}/>)}
                </SortableContext>
            </div>
            <AddCard columnId={data._id}/>
        </div>
    )
}