import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import {
  LayoutDashboard,
  Users,
  Settings,
  Activity,
  Shield,
  Menu,
  Search,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser } from '@/lib/db/queries';
import { signOut } from '@/app/(login)/actions';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/teams', icon: Users, label: 'Teams' },
  { href: '/dashboard/general', icon: Settings, label: 'General' },
  { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
  { href: '/dashboard/security', icon: Shield, label: 'Security' },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getUser();
  const organizationName = user?.organizationName || 'My Organization';
  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar pathname={pathname} />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Header user={user} organizationName={organizationName} />
        <main className='flex-1 overflow-y-auto p-4 sm:p-6'>{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className='w-64 bg-white dark:bg-brand-dark border-r border-gray-200 hidden lg:block'>
      <div className='p-4 flex items-center justify-between'>
        <div className='w-[80px] h-[40px] relative'>
          <Image
            src='/logo.svg'
            alt='Teammo Logo'
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      <nav className='h-full overflow-y-auto py-6 flex flex-col justify-between'>
        <div>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </div>
        <div className='mt-auto'>
          <form action={signOut}>
            <Button
              type='submit'
              variant='ghost'
              className='w-full justify-start px-4 py-2 text-gray-600 hover:text-gray-900'
            >
              <LogOut className='mr-3 h-5 w-5 text-gray-400' />
              Sign Out
            </Button>
          </form>
        </div>
      </nav>
    </aside>
  );
}

function NavItem({
  item,
  isActive,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
}) {
  return (
    <Link href={item.href} passHref>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={`my-1 w-full justify-start px-4 py-2 ${
          isActive
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <item.icon className='mr-3 h-5 w-5 text-gray-400' />
        {item.label}
      </Button>
    </Link>
  );
}

function Header({
  user,
  organizationName,
}: {
  user: any;
  organizationName: string;
}) {
  return (
    <header className='bg-white border-b border-gray-200 py-4 px-4 sm:px-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='icon' className='lg:hidden'>
            <Menu className='h-6 w-6' />
          </Button>
          <OrganizationSelect organizationName={organizationName} />
        </div>
        <div className='flex items-center space-x-4 sm:space-x-6'>
          <SearchInput />
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  );
}

function OrganizationSelect({
  organizationName,
}: {
  organizationName: string;
}) {
  return (
    <Select defaultValue={organizationName}>
      <SelectTrigger className='w-[180px] hidden sm:inline-flex'>
        <SelectValue>{organizationName}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={organizationName}>{organizationName}</SelectItem>
      </SelectContent>
    </Select>
  );
}

function SearchInput() {
  return (
    <>
      <div className='relative hidden sm:block'>
        <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
        <Input
          type='text'
          placeholder='Search'
          className='pl-8 pr-4 py-1 w-64 bg-gray-50 text-sm rounded-full'
        />
      </div>
      <Button variant='ghost' size='icon' className='sm:hidden'>
        <Search className='h-5 w-5' />
      </Button>
    </>
  );
}

function UserDropdown({ user }: { user: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar>
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
              alt={user?.name || 'User'}
            />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user?.name || 'User'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className='mr-2 h-4 w-4' />
          <Link href={`/dashboard/general`}>General</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOut} className='w-full'>
            <Button
              type='submit'
              variant='ghost'
              className='w-full justify-start px-2 py-1.5 text-sm'
            >
              <LogOut className='mr-2 h-4 w-4' />
              Sign Out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
