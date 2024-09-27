'use client';

import { useState, useCallback, useOptimistic, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addTask, updateTask, deleteTask } from '../action';
import { useFormState } from 'react-dom';


import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
} from 'react-beautiful-dnd';

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
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Task = {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  description?: string;
};

const TaskCard = ({
  task,
  onClick,
  provided,
}: {
  task: Task;
  onClick: () => void;
  provided: DraggableProvided;
}) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className='bg-white rounded-lg p-4 shadow-sm mb-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200'
    onClick={onClick}
  >
    <p className='font-medium'>{task.title}</p>
    <p className='text-sm text-gray-500 mt-1 truncate'>
      {task.description || 'No description'}
    </p>
  </div>
);

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

const TaskColumn = ({
  column,
  tasks,
  onAddTask,
  onSelectTask,
  provided,
}: {
  column: 'To Do' | 'In Progress' | 'Done';
  tasks: Task[];
  onAddTask: (title: string) => void;
  onSelectTask: (task: Task) => void;
  provided: DroppableProvided;
}) => (
  <div
    {...provided.droppableProps}
    ref={provided.innerRef}
    className='flex-1 min-w-[250px] rounded-lg p-4 flex flex-col'
  >
    <h2 className='font-semibold mb-4 flex items-center'>
      {getStatusBadge(column)}
      <span className='ml-2 text-gray-600'>({tasks.length})</span>
    </h2>
    {tasks.map((task, index) => (
      <Draggable key={task.id} draggableId={task.id} index={index}>
        {(provided) => (
          <TaskCard
            task={task}
            onClick={() => onSelectTask(task)}
            provided={provided}
          />
        )}
      </Draggable>
    ))}
    {provided.placeholder}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Input
            type='text'
            placeholder='Add new task'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddTask(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className='w-full mt-4'
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Press Enter to add a new task</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask: Task) => [...state, newTask]
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addTask = useCallback(
    (status: 'To Do' | 'In Progress' | 'Done', title: string) => {
      if (title.trim() === '') return;
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        status,
      };

      startTransition(() => {
        addOptimisticTask(newTask);
        setTasks((prevTasks) => [...prevTasks, newTask]);
      });
    },
    [addOptimisticTask]
  );

  const moveTask = useCallback(
    (taskId: string, newStatus: 'To Do' | 'In Progress' | 'Done') => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    },
    []
  );

  const updateTaskDescription = useCallback(
    (id: string, description: string) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, description } : task
        )
      );
    },
    []
  );

  const saveTaskChanges = (task: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));
    setTasks(updatedTasks);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, reorderedTask);

    const newStatus = destination.droppableId as
      | 'To Do'
      | 'In Progress'
      | 'Done';
    const taskToUpdate = updatedTasks.find((task) => task.id === draggableId);
    if (taskToUpdate) {
      taskToUpdate.status = newStatus;
    }

    setTasks(updatedTasks);
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tasks</h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex-1 flex space-x-4 overflow-x-auto pb-4'>
          {['To Do', 'In Progress', 'Done'].map((column) => (
            <Droppable key={column} droppableId={column} direction='vertical'>
              {(provided) => (
                <TaskColumn
                  column={column as 'To Do' | 'In Progress' | 'Done'}
                  tasks={tasks.filter((task) => task.status === column)}
                  onAddTask={(title) =>
                    addTask(column as 'To Do' | 'In Progress' | 'Done', title)
                  }
                  onSelectTask={(task) => {
                    setSelectedTask(task);
                    setIsDialogOpen(true);
                  }}
                  provided={provided}
                />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedTask(null);
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='text-xl'>{selectedTask?.title}</DialogTitle>
            <DialogDescription className='flex items-center mt-2'>
              Status: {selectedTask && getStatusBadge(selectedTask.status)}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                value={selectedTask?.status}
                onValueChange={(value) => {
                  const newStatus = value as 'To Do' | 'In Progress' | 'Done';
                  setSelectedTask(
                    selectedTask ? { ...selectedTask, status: newStatus } : null
                  );
                }}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='To Do'>To Do</SelectItem>
                  <SelectItem value='In Progress'>In Progress</SelectItem>
                  <SelectItem value='Done'>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <Textarea
                id='description'
                placeholder='Add a description...'
                value={selectedTask?.description || ''}
                onChange={(e) => {
                  setSelectedTask(
                    selectedTask
                      ? { ...selectedTask, description: e.target.value }
                      : null
                  );
                }}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (selectedTask) {
                  saveTaskChanges(selectedTask);
                  moveTask(selectedTask.id, selectedTask.status);
                  updateTaskDescription(
                    selectedTask.id,
                    selectedTask.description || ''
                  );
                  setSelectedTask(null);
                  setIsDialogOpen(false);
                }
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
