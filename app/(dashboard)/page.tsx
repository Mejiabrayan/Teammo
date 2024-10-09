import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='px-4 lg:px-6 h-16 flex items-center'>
        <Link href='/' className='flex items-center justify-center'>
          <Image src='/logo.svg' alt='Teammo Logo' width={80} height={45} />
        </Link>
      </header>
      <main className='flex-1'>
        <section className='w-full py-16 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6 mx-auto'>
            <div className='grid gap-8 lg:grid-cols-2 lg:gap-12 items-center'>
              <div className='flex flex-col justify-center space-y-6'>
                <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-gray-900'>
                  Collaborate Effortlessly with Teammo
                </h1>
                <p className='max-w-[600px] text-xl text-gray-600'>
                  The ultimate task manager for freelancers. Streamline your
                  workflow, collaborate seamlessly, and boost your productivity.
                  We're so simple, we don't even need a feature section. Just
                  sign up and experience the power of intuitive task management.
                </p>
                <div className='space-y-4'>
                  <Link href='/sign-up'>
                    <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              <div className='relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl'>
                <Image
                  src='/teammo.png'
                  alt='Teammo Dashboard'
                  layout='fill'
                  objectFit='cover'
                  objectPosition='top'
                  priority
                  className='transition-transform duration-300 hover:scale-105'
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='py-8'>
        <div className='container px-4 md:px-6 mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center'></div>
          <div className='mt-4 text-center text-sm text-gray-400'>
            © {new Date().getFullYear()} Teammo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
