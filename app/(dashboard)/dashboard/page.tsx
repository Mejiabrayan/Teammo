'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useOptimistic } from 'react';
import { createSwapy } from '@/config';

type Task = {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask: Task) => [...state, newTask]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTask = (status: 'To Do' | 'In Progress' | 'Done') => {
    if (newTaskTitle.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status,
    };

    addOptimisticTask(newTask);
    // Here you would typically make an API call to save the task
    // For now we'll just simulate a delay
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskTitle('');
  };

  const moveTask = (
    taskId: string,
    newStatus: 'To Do' | 'In Progress' | 'Done'
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    const movedTask = updatedTasks.find((task) => task.id === taskId);
    if (movedTask) {
      addOptimisticTask(movedTask);
    }
    // Here you would typically make an API call to save the task
    // For now we'll just simulate a delay
    setTasks(updatedTasks);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask('To Do');
    }
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tasks</h1>
        <div className='flex items-center'>
          <Input
            type='text'
            placeholder='New task title'
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            ref={inputRef}
            className='mr-2'
          />
          <Button onClick={() => addTask('To Do')}>
            <Plus className='mr-2 h-4 w-4' />
            Add New Task
          </Button>
        </div>
      </div>
      <div className='flex-1 flex space-x-4 overflow-x-auto pb-4'>
        {['To Do', 'In Progress', 'Done'].map((column) => (
          <div key={column} className='flex-1 min-w-[250px] rounded-lg p-4'>
            <h2 className='font-semibold mb-4'>{column}</h2>
            {optimisticTasks.filter(task => task.status === column).map(
              task => (
                <div key={task.id} className='bg-white rounded-lg p-4 shadow-sm mb-4'>
                  <p>{task.title}</p>
                  {column !== 'Done' && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => moveTask(task.id, column === 'To Do' ? 'In Progress' : 'Done')}
                      className='mt-2'
                    >
                      Move to {column === 'To Do' ? 'In Progress' : 'Done'}
                    </Button>
                  )}
                </div>
              )
            )}
            {optimisticTasks.filter(task => task.status === column).length === 0 && (
              <div className='bg-white rounded-lg p-4 shadow-sm mb-4'>
                <p className='text-gray-500 text-sm'>No tasks yet</p>
              </div>
            )}
            <Button variant='ghost' className='w-full justify-start text-gray-500' onClick={() => addTask(column as 'To Do' | 'In Progress' | 'Done')}>
              <Plus className='mr-2 h-4 w-4' />
              Add New Task
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}