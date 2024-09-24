'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOptimistic } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

type Task = {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  description?: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask: Task) => [...state, newTask]
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTask = (status: 'To Do' | 'In Progress' | 'Done', title: string) => {
    if (title.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status,
    };

    addOptimisticTask(newTask);
    // Here you would typically make an API call to save the task
    // For now we'll just simulate a delay
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const moveTask = (
    taskId: string,
    newStatus: 'To Do' | 'In Progress' | 'Done'
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    status: 'To Do' | 'In Progress' | 'Done'
  ) => {
    if (e.key === 'Enter') {
      addTask(status, e.currentTarget.value);
      e.currentTarget.value = '';
    }
  };

  const getStatusBadge = (status: 'To Do' | 'In Progress' | 'Done') => {
    switch (status) {
      case 'To Do':
        return (
          <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
            To Do
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
            In Progress
          </Badge>
        );
      case 'Done':
        return (
          <Badge variant='secondary' className='bg-green-100 text-green-800'>
            Done
          </Badge>
        );
    }
  };

  const updateTaskDescription = (id: string, description: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, description } : task
    );
    setTasks(updatedTasks);
  };

  const saveTaskChanges = (task: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(updatedTasks);
    // Here you would typically make an API call to save the updated task
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tasks</h1>
      </div>
      <div className='flex-1 flex space-x-4 overflow-x-auto pb-4'>
        {['To Do', 'In Progress', 'Done'].map((column) => (
          <div key={column} className='flex-1 min-w-[250px] rounded-lg p-4'>
            <h2 className='font-semibold mb-4 flex items-center'>
              {getStatusBadge(column as 'To Do' | 'In Progress' | 'Done')}
            </h2>
            {optimisticTasks
              .filter((task) => task.status === column)
              .map((task) => (
                <Dialog key={task.id}>
                  <DialogTrigger asChild>
                    <div className='bg-white rounded-lg p-4 shadow-sm mb-4 cursor-pointer hover:bg-gray-50'>
                      <p className='font-medium'>{task.title}</p>
                      <p className='text-sm text-gray-500 mt-1 truncate'>
                        {task.description || 'No description'}
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                      <DialogTitle className='text-xl'>
                        {task.title}
                      </DialogTitle>
                      <DialogDescription className='flex items-center mt-2'>
                        Status: {getStatusBadge(task.status)}
                      </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='status' className='text-right'>
                          Status
                        </Label>
                        <select
                          id='status'
                          className='col-span-3'
                          value={selectedTask?.status || task.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as 'To Do' | 'In Progress' | 'Done';
                            setSelectedTask({...task, status: newStatus});
                          }}
                        >
                          <option value='To Do'>To Do</option>
                          <option value='In Progress'>In Progress</option>
                          <option value='Done'>Done</option>
                        </select>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='description' className='text-right'>
                          Description
                        </Label>
                        <Textarea
                          id='description'
                          placeholder='Add a description...'
                          value={selectedTask?.description || task.description || ''}
                          onChange={(e) => {
                            setSelectedTask({...task, description: e.target.value});
                          }}
                          className='col-span-3'
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => {
                        if (selectedTask) {
                          saveTaskChanges(selectedTask);
                          moveTask(selectedTask.id, selectedTask.status);
                          updateTaskDescription(selectedTask.id, selectedTask.description || '');
                          setSelectedTask(null);
                        }
                      }}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    type='text'
                    placeholder='Add new task'
                    onKeyDown={(e) =>
                      handleKeyPress(
                        e,
                        column as 'To Do' | 'In Progress' | 'Done'
                      )
                    }
                    className='w-full mt-4'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Press Enter to add a new task</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
