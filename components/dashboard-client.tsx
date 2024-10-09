'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/types/task'
import { TaskColumn } from '@/components/task-column'
import { TaskDialog } from '@/components/task-dialog'
import { AddTaskForm } from '@/components/add-task-form'

interface DashboardClientProps {
  initialTasks: Task[]
}

export function DashboardClient({ initialTasks }: DashboardClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const router = useRouter()

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
    setSelectedTask(null)
  }

  const handleDeleteTask = async (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    setSelectedTask(null)
    router.refresh()
  }

  return (
    <div className="h-full flex flex-col">
      <DashboardHeader onTaskAdded={handleTaskAdded} />
      <TaskBoard
        tasks={tasks}
        onSelectTask={handleSelectTask}
        onDeleteTask={handleDeleteTask}
      />
      <TaskDialog
        task={selectedTask}
        onTaskUpdatedAction={handleTaskUpdated}
        onCloseAction={() => setSelectedTask(null)}
        onTaskDeletedAction={handleDeleteTask}
      />
    </div>
  )
}

function DashboardHeader({ onTaskAdded }: { onTaskAdded: (task: Task) => void }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <AddTaskForm onTaskAddedAction={onTaskAdded} />
    </div>
  )
}

function TaskBoard({
  tasks,
  onSelectTask,
  onDeleteTask,
}: {
  tasks: Task[]
  onSelectTask: (task: Task) => void
  onDeleteTask: (taskId: number) => void
}) {
  const columns: Array<'To Do' | 'In Progress' | 'Done'> = ['To Do', 'In Progress', 'Done']

  return (
    <div className="flex-1 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <TaskColumn
          key={column}
          column={column}
          tasks={tasks.filter((task) => task.status === column)}
          onSelectTask={onSelectTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  )
}