'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateTask } from '../app/(dashboard)/actions';
import { Task } from '@/types/task';
import { useRouter } from 'next/navigation';

interface TaskDialogProps {
  task: Task | null;
  onTaskUpdatedAction: (updatedTask: Task) => void;
  onCloseAction: () => void;
}

export function TaskDialog({ task, onTaskUpdatedAction, onCloseAction }: TaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (task) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) return;
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateTask({
        id: task.id,
        title: formData.get('title') as string,
        status: formData.get('status') as 'To Do' | 'In Progress' | 'Done',
        description: formData.get('description') as string | null,
      });

      if ('error' in result) {
        console.error('Failed to update task:', result.error);
        // Handle error (e.g., show a toast notification)
      } else {
        onTaskUpdatedAction({
          id: result.task.id,
          userId: result.task.userId,
          title: result.task.title,
          description: result.task.description,
          status: result.task.status as 'To Do' | 'In Progress' | 'Done',
          createdAt: result.task.createdAt,
          updatedAt: result.task.updatedAt
        });
        router.refresh();
        handleClose();
      }
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    onCloseAction();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <Input
              name='title'
              defaultValue={task.title}
              placeholder='Task title'
              required
            />
            <Select name='status' defaultValue={task.status}>
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='To Do'>To Do</SelectItem>
                <SelectItem value='In Progress'>In Progress</SelectItem>
                <SelectItem value='Done'>Done</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              name='description'
              defaultValue={task.description || ''}
              placeholder='Task description (optional)'
            />
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}