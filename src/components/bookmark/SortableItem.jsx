import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BookmarkItem from './BookmarkItem';

export const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.data.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    width: '100%',     
    display: 'block',   
    boxSizing: 'border-box'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BookmarkItem 
        {...props} 
        dragHandleProps={listeners}
      />
    </div>
  );
};