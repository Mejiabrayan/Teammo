'use server';

import { db } from '@/lib/db/drizzle';
import { tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/db/queries';
import { z } from 'zod';
import { validatedActionWithUser } from '@/lib/auth/middleware';

const addTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
});

export const addTask = validatedActionWithUser(
  addTaskSchema,
  async (data, _, user) => {
    const { title, status } = data;

    await db.insert(tasks).values({
      userId: user.id,
      title,
      status,
    });

    revalidatePath('/dashboard');
    return { success: 'Task added successfully' };
  }
);

const updateTaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['To Do', 'In Progress', 'Done']),
  description: z.string().optional(),
});

export const updateTask = validatedActionWithUser(
  updateTaskSchema,
  async (data, _, user) => {
    const { id, title, status, description } = data;

    await db
      .update(tasks)
      .set({ title, status, description })
      .where(eq(tasks.id, id));

    revalidatePath('/dashboard');
    return { success: 'Task updated successfully' };
  }
);

const deleteTaskSchema = z.object({
  id: z.number(),
});

export const deleteTask = validatedActionWithUser(
  deleteTaskSchema,
  async (data, _, user) => {
    const { id } = data;

    await db.delete(tasks).where(eq(tasks.id, id));

    revalidatePath('/dashboard');
    return { success: 'Task deleted successfully' };
  }
);