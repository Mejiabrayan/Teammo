'use client';

import { useState, useCallback, useOptimistic, startTransition } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Task } from '@/types/task';
import { TaskColumn } from '@/components/task-column';
import { TaskDialog } from '@/components/task-dialog';
import { AddTaskForm } from '@/components/add-task';
import { addTask, updateTask, deleteTask } from '../action';


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

  const saveTaskChanges = useCallback((task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? task : t))
    );
    setSelectedTask(null);
    setIsDialogOpen(false);
  }, []);

  const deleteTaskChanges = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setSelectedTask(null);
    setIsDialogOpen(false);
  }, []);

  const onDragEnd = useCallback(
    (result: any) => {
      const { destination, source, draggableId } = result;

      if (
        !destination ||
        (destination.droppableId === source.droppableId &&
          destination.index === source.index)
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
    },
    [tasks]
  );

  return (
    <div className='h-full flex flex-col'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tasks</h1>
        <AddTaskForm onAddTaskAction={addTask} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex-1 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto pb-4'>
          {['To Do', 'In Progress', 'Done'].map((column) => (
            <Droppable key={column} droppableId={column} direction='vertical'>
              {(provided) => (
                <TaskColumn
                  column={column as 'To Do' | 'In Progress' | 'Done'}
                  tasks={tasks.filter((task) => task.status === column)}
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
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={saveTaskChanges}
        onDelete={deleteTaskChanges}
        onStatusChange={(status) =>
          setSelectedTask(selectedTask ? { ...selectedTask, status } : null)
        }
        onTitleChange={(title) =>
          setSelectedTask(selectedTask ? { ...selectedTask, title } : null)
        }
        onDescriptionChange={(description) =>
          setSelectedTask(
            selectedTask ? { ...selectedTask, description } : null
          )
        }
      />
    </div>
  );
}
