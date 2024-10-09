import { TaskTag } from '@/lib/db/schema';



export type Task = {
  id: number;
  creatorId: number;
  assigneeId: number;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  priority: string;
  tags: TaskTag[];
};

export type User = {
  id: number;
  name: string | null;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  organizationName: string | null;
};

export type Team = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeProductId: string | null;
  planName: string | null;
  subscriptionStatus: string | null;
  organizationName: string | null;
};



export type TeamMember = {
  id: number;
  userId: number;
  teamId: number;
  role: string;
  joinedAt: Date;
};

export type ActivityLog = {
  id: number;
  teamId: number;
  userId: number | null;
  action: string;
  timestamp: Date;
  ipAddress: string | null;
};

export type Invitation = {
  id: number;
  teamId: number;
  email: string;
  role: string;
  invitedBy: number;
  invitedAt: Date;
  status: string;
};