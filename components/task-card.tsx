import { Task } from '@/types/task';

export const TaskCard = ({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
  onDelete: () => void;
}) => (
  <div className='bg-white rounded-lg p-4 shadow-sm mb-4 cursor-pointer relative'>
    <div onClick={onClick}>
      <p className='font-medium'>{task.title}</p>
      <p className='text-sm text-gray-500 mt-1 truncate'>
        {task.description || 'No description'}
      </p>
    </div>
  </div>
);
