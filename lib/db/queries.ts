
import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, teamMembers, teams, users, tasks } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { Task, User, Team, TeamMember, ActivityLog } from '@/types/task';
import { TaskTag } from '@/lib/db/schema';

export async function getTasks(userId: number): Promise<Task[]> {
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.creatorId, userId))
    .orderBy(desc(tasks.createdAt));

  return result.map(task => ({
    id: task.id,
    creatorId: task.creatorId,
    assigneeId: task.assigneeId,
    title: task.title,
    description: task.description,
    status: task.status as 'To Do' | 'In Progress' | 'Done',
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    priority: task.priority as 'low' | 'medium' | 'high',
    tags: task.tags as TaskTag[]
  }));
}

export async function getUser(): Promise<User | null> {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string): Promise<Team | null> {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
): Promise<void> {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number): Promise<{
  user: User;
  teamId: number | null;
  organizationName: string | null;
} | null> {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
      organizationName: users.organizationName,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const logs = await db
    .select({
      id: activityLogs.id,
      teamId: activityLogs.teamId,
      userId: activityLogs.userId,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);

  return logs.map(log => ({
    id: log.id,
    teamId: log.teamId,
    userId: log.userId,
    action: log.action,
    timestamp: log.timestamp,
    ipAddress: log.ipAddress,
    userName: log.userName || null,
  }));
}

export async function getTeamMembers(teamId: number): Promise<Pick<User, 'id' | 'name' | 'email'>[]> {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId));

  return result;
}

export async function getTeamForUser(userId: number): Promise<(Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email' | 'organizationName'>;
  })[];
}) | null> {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                      organizationName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}
