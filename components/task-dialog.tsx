import { Save, Trash2 } from "lucide-react";
import { getStatusBadge } from "./get-status-badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Task } from "../types/task";

export const TaskDialog = ({
    isOpen,
    onClose,
    task,
    onSave,
    onDelete,
    onStatusChange,
    onTitleChange,
    onDescriptionChange
  }: {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onStatusChange: (status: 'To Do' | 'In Progress' | 'Done') => void;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
  }) => {
    if (!task) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-screen h-screen flex flex-col p-0'>
          <div className='p-6'>
            <DialogHeader>
              <DialogTitle className='text-2xl'>{task.title}</DialogTitle>
              <DialogDescription className='flex items-center mt-2'>
                {getStatusBadge(task.status)}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className='flex-grow flex flex-col gap-6 p-6 overflow-y-auto'>
            <div className='p-6'>
              <Label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-2'>
                Status
              </Label>
              <Select value={task.status} onValueChange={onStatusChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='To Do'>To Do</SelectItem>
                  <SelectItem value='In Progress'>In Progress</SelectItem>
                  <SelectItem value='Done'>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='p-6'>
              <Label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
                Title
              </Label>
              <Input
                id='title'
                value={task.title}
                onChange={(e) => onTitleChange(e.target.value)}
                className='w-full'
              />
            </div>
            <div className='p-6 flex-grow'>
              <Label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2'>
                Description
              </Label>
              <Textarea
                id='description'
                placeholder='Add a description...'
                value={task.description || ''}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className='w-full h-full resize-none'
              />
            </div>
          </div>
          <div className='bg-white p-6 shadow-sm'>
            <DialogFooter>
              <Button variant='destructive' onClick={() => onDelete(task.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button onClick={() => onSave(task)}>
                <Save className="w-4 h-4 mr-2" />
                Save changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  };