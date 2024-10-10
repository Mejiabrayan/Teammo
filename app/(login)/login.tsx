'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {mode === 'signin' ? 'Sign in' : 'Sign up'}
        </h2>

        <form className="mt-8 space-y-6" action={formAction}>
          <input type="hidden" name="redirect" value={redirect || ''} />
          <input type="hidden" name="priceId" value={priceId || ''} />
          <input type="hidden" name="inviteId" value={inviteId || ''} />
          
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={50}
            placeholder="Email address"
          />

          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            maxLength={100}
            placeholder="Password"
          />

          {state?.error && (
            <div className="text-red-500 text-sm">{state.error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Loading...
              </>
            ) : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </Button>
        </form>

        <div className="text-sm text-center">
          {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
              redirect ? `?redirect=${redirect}` : ''
            }${priceId ? `&priceId=${priceId}` : ''}`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </Link>
        </div>
      </div>
    </div>
  );
}
