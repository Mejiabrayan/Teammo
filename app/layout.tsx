import './globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Teammo - The Team Management Platform',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.',
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html lang='en' className={`${manrope.className}`}>
      <body className='min-h-screen'>
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
