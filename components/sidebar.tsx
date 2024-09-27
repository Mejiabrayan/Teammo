'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Menu, LayoutDashboard, Users, Settings, Activity, Shield } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/teams', icon: Users, label: 'Teams' },
  { href: '/dashboard/general', icon: Settings, label: 'General' },
  { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
  { href: '/dashboard/security', icon: Shield, label: 'Security' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <aside
        className={`
          w-64 bg-white border-r border-gray-200
          fixed top-0 left-0 z-40 h-full
          transition-transform duration-300 ease-in-out
          -translate-x-full
          lg:relative lg:translate-x-0
        `}
      >
        <div className='p-4 flex items-center justify-between'>
          <div className='w-[80px] h-[40px] relative'>
            <Image src='/logo.svg' alt='Teammo Logo' fill style={{ objectFit: 'contain' }} />
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={() => setIsSidebarOpen(false)}
          >
            <Menu className='h-6 w-6' />
          </Button>
        </div>

        <nav className='h-full overflow-y-auto py-6'>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={`my-1 w-full justify-start px-4 py-2 ${
                  pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
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
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-30
          transition-opacity duration-300 ease-in-out
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          lg:hidden
        `}
        onClick={() => setIsSidebarOpen(false)}
      />
      <Button
        variant='ghost'
        size='icon'
        className='fixed top-4 left-4 z-50 lg:hidden'
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className='h-6 w-6' />
      </Button>
    </>
  );
}