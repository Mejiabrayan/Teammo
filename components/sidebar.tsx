import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Settings,
  Activity,
  Shield,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/teams', icon: Users, label: 'Teams' },
  { href: '/dashboard/general', icon: Settings, label: 'General' },
  { href: '/dashboard/activity', icon: Activity, label: 'Activity' },
  { href: '/dashboard/security', icon: Shield, label: 'Security' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`
          w-64 bg-white dark:bg-brand-dark 
          fixed top-0 left-0 z-40 h-full
          lg:relative lg:translate-x-0
        `}
    >
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

      <nav className='h-full overflow-y-auto py-6'>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <Button
              variant={pathname === item.href ? 'secondary' : 'ghost'}
              className={`my-1 w-full justify-start px-4 py-2 ${
                pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <item.icon className='mr-3 h-5 w-5 text-gray-400 ' />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
