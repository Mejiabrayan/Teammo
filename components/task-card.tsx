import { DraggableProvided } from "react-beautiful-dnd";
import { Task } from "@/types/task";


export const TaskCard = ({
    task,
    onClick,
    provided,
  }: {
    task: Task;
    onClick: () => void;
    provided: DraggableProvided;
  }) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className='bg-white rounded-lg p-4 shadow-sm mb-4 cursor-pointer'
      onClick={onClick}
    >
      <p className='font-medium'>{task.title}</p>
      <p className='text-sm text-gray-500 mt-1 truncate'>
        {task.description || 'No description'}
      </p>
    </div>
  );
  