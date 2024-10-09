import { Task} from '@/types/task';
import { TaskTag } from '@/lib/db/schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, Trash2Icon, TagIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const TaskCard = ({
  task,
  onClick,
  onDelete,
}: {
  task: Task;
  onClick: () => void;
  onDelete: () => void;
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'To Do':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagColor = (tag: TaskTag) => {
    switch (tag) {
      case 'design':
        return 'bg-pink-100 text-pink-800';
      case 'research':
        return 'bg-indigo-100 text-indigo-800';
      case 'prototype':
        return 'bg-orange-100 text-orange-800';
      case 'client':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className='mb-4 hover:shadow-md transition-shadow duration-200'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-2'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className='w-8 h-8 border-2 border-white'>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=User${task.assigneeId}`}
                  alt={`User ${task.assigneeId}`}
                />
                <AvatarFallback>{`U${task.assigneeId}`}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>Assignee ID: {task.assigneeId}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Badge variant='secondary' className={getPriorityColor(task.priority)}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent onClick={onClick} className='cursor-pointer'>
        <h3 className='text-lg font-semibold mb-2'>{task.title}</h3>
        <div className='flex flex-wrap gap-2 mb-2'>
          <Badge variant='secondary' className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
          {task.tags.map((tag, index) => (
            <Badge key={index} variant='outline' className={getTagColor(tag)}>
              <TagIcon className='w-3 h-3 mr-1' />
              {tag}
            </Badge>
          ))}
        </div>
        {task.description && (
          <p className='text-sm text-gray-600 mb-2 line-clamp-2'>{task.description}</p>
        )}
      </CardContent>
      <CardFooter className='flex justify-between items-center'>
        <div className='flex items-center text-sm text-gray-500'>
          <CalendarIcon className='w-4 h-4 mr-1' />
          <span>Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
        </div>
   
      </CardFooter>
    </Card>
  );
};
