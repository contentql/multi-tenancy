'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { signInAction } from '@/actions/auth'
import { signInSchema } from '@/actions/auth/validator'
import { Alert, AlertDescription } from '@/components/common/Alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const SignInForm: React.FC = () => {
  const router = useRouter()

  const {
    execute: mutate,
    isPending,
    hasSucceeded: isSuccess,
    hasErrored: isError,
    result,
  } = useAction(signInAction, {
    onSuccess: ({ data: user }) => {
      const userRole = user?.role ?? []

      if (userRole.includes('admin')) {
        router.push('/admin')
      } else if (userRole.includes('user')) {
        // router.push('/profile')
        router.push('/admin')
      }
      reset()
    },
  })

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { handleSubmit, reset } = form

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    mutate({
      ...data,
    })
  }

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='mx-auto w-full max-w-md  drop-shadow-2xl'>
        <div className='w-full max-w-md p-6'>
          {isSuccess ? (
            <Alert variant='success' className='mb-12'>
              <AlertDescription>
                Successfully logged in! Redirecting...
              </AlertDescription>
            </Alert>
          ) : isError ? (
            <Alert variant='danger' className='mb-12'>
              <AlertDescription>
                Sign in failed. Check the details you provided are incorrect.
              </AlertDescription>
            </Alert>
          ) : null}

          <h1 className='mb-6 text-3xl font-semibold'>Sign In</h1>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name={'email'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input
                        disabled={isSuccess}
                        {...field}
                        placeholder='john.doe@example.com'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name={'password'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <Input
                          disabled={isSuccess}
                          {...field}
                          type='password'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className='text-sm text-muted-foreground'>
                  Forgot your password?{' '}
                  <Link
                    className='text-primary underline'
                    href='/forgot-password'>
                    Reset it.
                  </Link>
                </p>
              </div>

              <Button
                className='w-full'
                type='submit'
                disabled={isPending || isSuccess}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>

          <div className='mt-4 text-center text-sm text-muted-foreground'>
            <p>
              Don&apos;t have an account?{' '}
              <Link href='/sign-up' className='text-primary underline'>
                SignUp
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInForm
