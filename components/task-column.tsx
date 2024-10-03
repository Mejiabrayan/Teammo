import { getStatusBadge } from "./get-status-badge";
import { TaskCard } from "./task-card";
import { Task } from "@/types/task";

interface TaskColumnProps {
  column: 'To Do' | 'In Progress' | 'Done';
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
}

export function TaskColumn({ column, tasks, onSelectTask, onDeleteTask }: TaskColumnProps) {
  return (
    <div className='flex-1 min-w-[250px] max-w-[350px] rounded-lg p-4 flex flex-col bg-gray-50'>
      <h2 className='font-semibold mb-4 flex items-center'>
        {getStatusBadge(column)}
        <span className='ml-2 text-gray-600 text-sm'>({tasks.length})</span>
      </h2>
      <div className='flex-1 overflow-y-auto'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onSelectTask?.(task)}
              onDelete={() => onDeleteTask?.(task.id)}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );
}