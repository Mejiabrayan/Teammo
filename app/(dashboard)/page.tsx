import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100'>
      <header className='px-4 lg:px-6 h-16 flex items-center shadow-sm'>
        <Link href='/' className='flex items-center justify-center'>
          <Image src='/logo.svg' alt='Teammo Logo' width={80} height={45} />
        </Link>
        <nav className='ml-auto flex gap-6'>
          {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              className='text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors'
              href={`#${item.toLowerCase()}`}
            >
              {item}
            </Link>
          ))}
        </nav>
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
                  The ultimate task manager for freelancers. Streamline your workflow, 
                  collaborate seamlessly, and boost your productivity.
                </p>
                <div className='space-y-4'>
                  <form className='flex max-w-md'>
                    <Input
                      className='flex-grow rounded-r-none'
                      placeholder='Enter your email'
                      type='email'
                      required
                    />
                    <Button type='submit' className='rounded-l-none bg-blue-600 hover:bg-blue-700 text-white'>
                      Get Started
                    </Button>
                  </form>
                  <p className='text-sm text-gray-500'>
                    Start your 14-day free trial. No credit card required.
                  </p>
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
        <section className='w-full py-16 bg-gray-50'>
          <div className='container px-4 md:px-6 mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-8'>Key Features</h2>
            <div className='grid gap-8 md:grid-cols-3'>
              {[
                { title: 'Task Management', description: 'Organize and prioritize your tasks effortlessly.' },
                { title: 'Team Collaboration', description: 'Work together seamlessly with your team members.' },
                { title: 'Progress Tracking', description: 'Monitor your project progress in real-time.' },
              ].map((feature, index) => (
                <div key={index} className='bg-white p-6 rounded-lg shadow-md'>
                  <h3 className='text-xl font-semibold mb-2'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className='bg-gray-900 text-white py-8'>
        <div className='container px-4 md:px-6 mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              <Image src='/teammo.png' alt='Teammo Logo' width={60} height={35} />
            </div>
            <div className='flex space-x-4'>
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
                <Link key={item} href='#' className='text-sm hover:underline'>
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className='mt-4 text-center text-sm text-gray-400'>
            © {new Date().getFullYear()} Teammo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
