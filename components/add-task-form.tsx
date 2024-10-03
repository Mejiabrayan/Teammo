'use client';

import { useRef, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Command } from 'lucide-react';
import { addTask } from '@/app/(dashboard)/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';

interface AddTaskFormProps {
  onTaskAddedAction: (newTask: Task) => void;
}

export function AddTaskForm({ onTaskAddedAction }: AddTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (document.activeElement === inputRef.current) {
          inputRef.current?.blur();
        } else {
          inputRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddTask = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addTask({
        title: formData.get('title') as string,
        status: 'To Do',
      });
      
      if ('error' in result) {
        console.error(result.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add task. Please try again.",
        });
      } else {
        onTaskAddedAction({
          ...result.task,
          status: result.task.status as 'To Do' | 'In Progress' | 'Done'
        });
        router.refresh();
        formRef.current?.reset();
        toast({
          title: "Success",
          description: "Task added successfully!",
        });
      }
    });
  };

  return (
    <form ref={formRef} action={handleAddTask} className='flex items-center'>
      <div className='relative flex-grow mr-2'>
        <Input
          ref={inputRef}
          name="title"
          placeholder='Add New Task (Cmd+K)'
          className='pr-8 text-sm font-medium text-gray-500'
          aria-label='Add new task'
        />
        <Command className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400' size={16} />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        aria-label='Add new task'
        className='shadow-md bg-gradient-to-tr from-blue-500 to-blue-600 text-white'
      > 
        {isPending ? 'Adding...' : 'Add Task'}
        <Plus className='w-4 h-4 ml-2' />
      </Button>
    </form>
  );
}