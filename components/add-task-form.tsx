'use client';

import { useRef, useTransition, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { addTask } from '@/app/(dashboard)/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types/task';
import { TaskTag } from '@/lib/db/schema';

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
        inputRef.current?.focus();
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
        assigneeId: 1, // Default assignee ID, update as needed
        priority: 'low',
        description: null,
        tags: [],
      });

      if ('error' in result) {
        console.error(result.error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add task. Please try again.',
        });
      } else {
        onTaskAddedAction({
          ...result.task,
          status: result.task.status as 'To Do' | 'In Progress' | 'Done',
          priority: result.task.priority as 'low' | 'medium' | 'high',
          assigneeId: result.task.assigneeId,
          tags: result.task.tags as TaskTag[],
        });
        router.refresh();
        formRef.current?.reset();
        toast({
          title: 'Success',
          description: 'Task added successfully!',
        });
      }
    });
  };

  return (
    <form ref={formRef} action={handleAddTask} className='flex items-center'>
      <div className='relative flex-grow'>
        <div
          className='
      relative
      before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:ring-2 before:ring-blue-500/20 before:transition
      after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight dark:after:shadow-white/5 dark:focus-within:after:shadow-blue-500/20 after:transition'
        >
          <Input
            ref={inputRef}
            name='title'
            placeholder='Add new task (Cmd+K)'
            aria-label='Add new task'
          />
        </div>
      </div>
    </form>
  );
}
