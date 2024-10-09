'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { updateTask, deleteTask } from '@/app/(dashboard)/actions';
import { Task } from '@/types/task';
import { TaskTag } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface TaskDialogProps {
  task: Task | null;
  onTaskUpdatedAction: (updatedTask: Task) => void;
  onCloseAction: () => void;
  onTaskDeletedAction?: (taskId: number) => void;
}

export function TaskDialog({
  task,
  onTaskUpdatedAction,
  onCloseAction,
  onTaskDeletedAction,
}: TaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsOpen(!!task);
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
        assigneeId: Number(formData.get('assigneeId')),
        priority: formData.get('priority') as 'low' | 'medium' | 'high',
        tags: formData.getAll('tags') as TaskTag[],
      });

      if ('error' in result) {
        console.error('Failed to update task:', result.error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update task. Please try again.',
        });
      } else {
        onTaskUpdatedAction(result.task as Task);
        router.refresh();
        handleClose();
        toast({
          title: 'Success',
          description: 'Task updated successfully!',
        });
      }
    });
  };

  const handleDelete = async () => {
    if (!task) return;

    startTransition(async () => {
      const result = await deleteTask({ id: task.id });

      if ('error' in result) {
        console.error('Failed to delete task:', result.error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete task. Please try again.',
        });
      } else {
        if (onTaskDeletedAction) {
          onTaskDeletedAction(task.id);
        }
        router.refresh();
        handleClose();
        toast({
          title: 'Success',
          description: 'Task deleted successfully!',
        });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-6'>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name='title'
                defaultValue={task.title}
                placeholder='Enter task title'
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name='description'
                defaultValue={task.description || ''}
                placeholder='Enter task description (optional)'
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigneeId">Assignee ID</Label>
              <Input
                id="assigneeId"
                name='assigneeId'
                type='number'
                defaultValue={task.assigneeId}
                placeholder='Enter assignee ID'
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select name='priority' defaultValue={task.priority}>
                <SelectTrigger>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Select name='tags' defaultValue={task.tags.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder='Select tags' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskTag.DESIGN}>Design</SelectItem>
                  <SelectItem value={TaskTag.RESEARCH}>Research</SelectItem>
                  <SelectItem value={TaskTag.PROTOTYPE}>Prototype</SelectItem>
                  <SelectItem value={TaskTag.CLIENT}>Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <DialogFooter className='flex justify-between'>
              <Button
                type='button'
                variant='destructive'
                onClick={handleDelete}
                disabled={isPending}
              >
                Delete Task
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Updating...' : 'Update Task'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
