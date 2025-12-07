import { Draggable } from '@hello-pangea/dnd';
import { PropsWithChildren } from 'react';
import { Task } from '../../services/taskService';

type TaskDraggableProps = PropsWithChildren<{
  task: Task;
  index: number;
}>;

const TaskDraggable = ({ task, index, children }: TaskDraggableProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
};

export default TaskDraggable;

