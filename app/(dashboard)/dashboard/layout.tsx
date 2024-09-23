'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Users,
  Settings,
  Shield,
  Activity,
  Menu,
  LayoutDashboard,
  Search,

} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/teams', icon: Users, label: 'Teams' },
    { href: '/dashboard/general', icon: Settings, label: 'General' },
    { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
    { href: '/dashboard/security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className='flex h-screen bg-white'>
      {/* Sidebar */}
      <aside
        className={`
        w-64 border-r border-gray-100
        fixed top-0 left-0 z-40 h-full
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}
      >
        <div className='p-4 flex items-center'>
          <Image src='/logo.svg' alt='Teammo Logo' width={80} height={40} />
        </div>

        <nav className='h-full overflow-y-auto py-4'>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={`my-1 w-full justify-start px-4 py-2 ${
                  pathname === item.href ? 'bg-gray-50' : ''
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className='mr-3 h-5 w-5' />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>
      <div className='flex-1 flex flex-col'>
        {/* Dashboard header */}
        <header className='border-b border-gray-100 py-4'>
          <div className='flex items-center justify-between px-6'>
            <div className='flex items-center space-x-4'>
              <Button
                variant='ghost'
                className='lg:hidden'
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className='h-6 w-6' />
              </Button>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rapidDrafts">RapidDrafts</SelectItem>
                  <SelectItem value="teamA">Team A</SelectItem>
                  <SelectItem value="teamB">Team B</SelectItem>
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
                  src='https://ui-avatars.com/api/?name=John+Doe'
                  alt='User'
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className='flex-1 overflow-y-auto p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
