import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='px-4 lg:px-6 h-14 flex items-center'>
        <a className='flex items-center justify-center' href='#'>
          <Image src='/teammo.png' alt='Teammo Logo' width={70} height={40} />
        </a>
        <nav className='ml-auto flex gap-4 sm:gap-6'>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            Features
          </a>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            Pricing
          </a>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            About
          </a>
          <a
            className='text-sm font-medium hover:underline underline-offset-4'
            href='#'
          >
            Contact
          </a>
        </nav>
      </header>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]'>
              <div className='flex flex-col justify-center space-y-4'>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                    Collaborate Effortlessly with Teammo
                  </h1>
                  <p className='max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400'>
                    The ultimate task manager for freelancers. Streamline your
                    workflow, collaborate seamlessly, and boost your
                    productivity.
                  </p>
                </div>
                <div className='w-full max-w-sm space-y-2'>
                  <form className='flex space-x-2'>
                    {/* <Input
                      className='max-w-lg flex-1'
                      placeholder='Enter your email'
                      type='email'
                    /> */}
                    <Button type='submit'><a href='/dashboard'>Get Started</a></Button>
                  </form>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Start your 14-day free trial. No credit card required.
                  </p>
                </div>
              </div>
              <div className='hidden lg:flex items-center justify-center overflow-hidden'>
                <div className='relative w-[500px] h-[250px] xl:w-[550px] xl:h-[275px]'>
                  <Image
                    src='/teammo.png'
                    alt='Teammo Dashboard'
                    layout='fill'
                    objectFit='cover'
                    objectPosition='top'
                    priority
                    className='rounded-t-2xl shadow-2xl'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
