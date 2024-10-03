'use server';

import { db } from '@/lib/db/drizzle';
import { tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getUser } from '@/lib/db/queries';

const addTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
});

export async function addTask(data: z.infer<typeof addTaskSchema>) {
  const user = await getUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { title, status } = addTaskSchema.parse(data);

  const [newTask] = await db.insert(tasks).values({
    userId: user.id,
    title,
    status,
  }).returning();

  revalidatePath('/dashboard');
  return { success: 'Task added successfully', task: newTask };
}

const updateTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  description: z.string().nullable(),
});

export async function updateTask(data: z.infer<typeof updateTaskSchema>) {
  const user = await getUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const { id, title, status, description } = updateTaskSchema.parse(data);

  const [updatedTask] = await db
    .update(tasks)
    .set({ 
      title, 
      status, 
      description, 
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