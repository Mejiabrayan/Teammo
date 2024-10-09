'use server';

import { db } from '@/lib/db/drizzle';
import { tasks, TaskTag } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getUser } from '@/lib/db/queries';
import { Task } from '@/types/task';

const addTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  assigneeId: z.number(),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  description: z.string().nullable(),
  tags: z.array(z.nativeEnum(TaskTag)).default([]),
});

export async function addTask(data: z.infer<typeof addTaskSchema>) {
  const user = await getUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { title, status, assigneeId, priority, description, tags } = addTaskSchema.parse(data);

  const [newTask] = await db.insert(tasks).values({
    creatorId: user.id,
    title,
    status,
    assigneeId,
    priority,
    description,
    tags,
  }).returning();

  revalidatePath('/dashboard');
  return { success: 'Task added successfully', task: newTask };
}

const updateTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  description: z.string().nullable(),
  assigneeId: z.number(),
  priority: z.enum(['low', 'medium', 'high']),
  tags: z.array(z.nativeEnum(TaskTag)),
});

export async function updateTask(data: z.infer<typeof updateTaskSchema>) {
  const user = await getUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { id, title, status, description, assigneeId, priority, tags } = updateTaskSchema.parse(data);

  const [updatedTask] = await db
    .update(tasks)
    .set({ 
      title, 
      status, 
      description, 
      assigneeId,
      priority,
      tags,
      updatedAt: new Date() 
    })
    .where(eq(tasks.id, id))
    .returning();

  if (!updatedTask) {
    return { error: 'Task not found or you do not have permission to update it' };
  }

  revalidatePath('/dashboard');
  return { success: 'Task updated successfully', task: updatedTask };
}

const deleteTaskSchema = z.object({
  id: z.number(),
});

export async function deleteTask(data: z.infer<typeof deleteTaskSchema>) {
  const user = await getUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { id } = deleteTaskSchema.parse(data);

  const [deletedTask] = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  if (!deletedTask) {
    return { error: 'Task not found or you do not have permission to delete it' };
  }

  revalidatePath('/dashboard');
  return { success: 'Task deleted successfully', task: deletedTask };
}