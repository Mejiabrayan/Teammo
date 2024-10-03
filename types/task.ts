export type Task = {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  status: 'To Do' | 'In Progress' | 'Done';
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  name: string | null;
  email: string;
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