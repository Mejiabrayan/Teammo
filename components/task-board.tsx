'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';
import { TaskColumn } from '@/components/task-column';
import { TaskDialog } from '@/components/task-dialog';
import { addTask, updateTask } from '@/app/(dashboard)/action';

interface TaskBoardProps {
  fetchTasksAction: () => Promise<Task[]>;
}

export function TaskBoard({ fetchTasksAction }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const fetchedTasks = await fetchTasksAction();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [fetchTasksAction]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = useCallback(
    async (status: 'To Do' | 'In Progress' | 'Done', title: string) => {
      if (title.trim() === '') return;

      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('status', status);

        const result = await addTask({}, formData);
        if (result.success && result.task) {
          const newTask: Task = {
            id: Number(result.task.id),
            title: result.task.title,
            status: result.task.status as 'To Do' | 'In Progress' | 'Done',
            description: result.task.description || '',
          };
          setTasks((prevTasks) => [...prevTasks, newTask]);
        } else {
          console.error('Failed to add task:', result);
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    []
  );

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialogAction = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedTask(null);
    loadTasks();
  }, [loadTasks]);

  return (
    <>
      <div className='flex-1 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto pb-4'>
        {['To Do', 'In Progress', 'Done'].map((column) => (
          <TaskColumn
            key={column}
            column={column as 'To Do' | 'In Progress' | 'Done'}
            tasks={tasks.filter((task) => task.status === column)}
            onSelectTask={handleSelectTask}
          />
        ))}
      </div>
      <TaskDialog
        isOpen={isDialogOpen}
        onCloseAction={handleCloseDialogAction}
        task={selectedTask}
      />
    </>
  );
}