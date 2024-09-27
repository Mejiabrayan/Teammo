export type Task = {
    id: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done';
    description?: string;
  };
