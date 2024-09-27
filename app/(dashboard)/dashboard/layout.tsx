import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sidebar } from '@/components/sidebar';
import { getUser } from '@/lib/db/queries';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const organizationName = user?.organizationName || 'My Organization';

  return (
    <div className='flex h-auto'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <header className='bg-white border-b border-gray-200 py-4 px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Button variant='ghost' size='icon' className='lg:hidden'>
                <Menu className='h-6 w-6' />
              </Button>
              <Select defaultValue={organizationName}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue>{organizationName}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={organizationName}>
                    {organizationName}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center space-x-6'>
              <div className='relative'>
                <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  type='text'
                  placeholder='Search'
                  className='pl-8 pr-4 py-1 w-64 bg-gray-50 text-sm rounded-full'
                />
              </div>
              <Avatar>
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${
                    user?.name || 'User'
                  }`}
                  alt={user?.name || 'User'}
                />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
