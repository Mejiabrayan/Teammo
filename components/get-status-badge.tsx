import { Badge } from "./ui/badge";

export const getStatusBadge = (status: 'To Do' | 'In Progress' | 'Done') => {
    switch (status) {
      case 'To Do':
        return (
          <Badge variant='secondary' className='bg-blue-100 text-blue-800'>
            To Do
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge variant='secondary' className='bg-yellow-100 text-yellow-800'>
            In Progress
          </Badge>
        );
      case 'Done':
        return (
          <Badge variant='secondary' className='bg-green-100 text-green-800'>
            Done
          </Badge>
        );
    }
  };