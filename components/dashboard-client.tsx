'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { TaskColumn } from '@/components/task-column';
import { TaskDialog } from '@/components/task-dialog';
import { AddTaskForm } from '@/components/add-task-form';
import { deleteTask } from '@/app/(dashboard)/actions';
import { useRouter } from 'next/navigation';

interface DashboardClientProps {
  initialTasks: Task[];
}

export function DashboardClient({ initialTasks }: DashboardClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const router = useRouter();

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId: number) => {
    const result = await deleteTask({ id: taskId });
    if ('error' in result) {
      console.error('Failed to delete task:', result.error);
      // Handle error (e.g., show a toast notification)
    } else {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      router.refresh();
    }
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tasks</h1>
        <AddTaskForm onTaskAddedAction={handleTaskAdded} />
      </div>
      <div className='flex-1 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto pb-4'>
        {['To Do', 'In Progress', 'Done'].map((column) => (
          <TaskColumn
            key={column}
            column={column as 'To Do' | 'In Progress' | 'Done'}
            tasks={tasks.filter((task) => task.status === column)}
            onSelectTask={handleSelectTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
      <TaskDialog
        task={selectedTask}
        onTaskUpdatedAction={handleTaskUpdated}
        onCloseAction={() => setSelectedTask(null)}
      />
    </div>
  );
}