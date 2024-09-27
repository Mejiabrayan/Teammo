'use client'

import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Command } from 'lucide-react';

export const AddTaskForm = ({
    onAddTaskAction,
  }: {
    onAddTaskAction: (status: 'To Do' | 'In Progress' | 'Done', title: string) => void;
  }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
  
    const handleAddTask = () => {
      if (newTaskTitle.trim()) {
        onAddTaskAction('To Do', newTaskTitle);
        setNewTaskTitle('');
      }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleAddTask();
      }
    };

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          inputRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown as any);
      return () => document.removeEventListener('keydown', handleKeyDown as any);
    }, []);
  
    return (
      <div className='flex items-center'>
        <div className='relative flex-grow mr-2'>
          <Input
            ref={inputRef}
            placeholder='Add New Task (Cmd+K)'
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            className='pr-8 text-sm font-medium text-gray-500'
            aria-label='Add new task'
          />
          <Command className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400' size={16} />
        </div>
        <Button
          onClick={handleAddTask}
          aria-label='Add new task'
        >
          <Plus className='w-4 h-4 ' />
      
        </Button>
      </div>
    );
  };