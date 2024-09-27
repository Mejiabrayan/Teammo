import React, { memo } from "react";
import { Draggable, DroppableProvided } from "react-beautiful-dnd";
import { getStatusBadge } from "./get-status-badge";
import { TaskCard } from "./task-card";
import { Task } from "../types/task";

export const TaskColumn = memo(({
    column,
    tasks,
    onAddTask,
    onSelectTask,
    provided,
  }: {
    column: 'To Do' | 'In Progress' | 'Done';
    tasks: Task[];
    onAddTask?: (title: string) => void;
    onSelectTask: (task: Task) => void;
    provided: DroppableProvided;
  }) => (
    <div
      {...provided.droppableProps}
      ref={provided.innerRef}
      className='flex-1 min-w-[250px] max-w-[350px] rounded-lg p-4 flex flex-col bg-gray-50'
    >
      <h2 className='font-semibold mb-4 flex items-center'>
        {getStatusBadge(column)}
        <span className='ml-2 text-gray-600 text-sm'>({tasks.length})</span>
      </h2>
      <div className='flex-1 overflow-y-auto'>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <TaskCard
                  task={task}
                  onClick={() => onSelectTask(task)}
                  provided={provided}
                />
              )}
            </Draggable>
          ))
        ) : (
          <div className="text-center text-green-500 py-4">
         {''}
          </div>
        )}
        {provided.placeholder}
      </div>
    </div>
  ));