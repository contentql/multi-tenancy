'use client'

import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const radius = 100 // change this to increase the rdaius of the hover effect
    const [visible, setVisible] = React.useState(false)

    let mouseX = useMotionValue(0)
    let mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect()

      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    }
    return (
      <motion.div
        style={{
          background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
          var(--indigo-600),
          transparent 80%
        )
      `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className='group/input rounded-lg p-[2px] transition duration-300'>
        <input
          type={type}
          className={cn(
            `placeholder-text-base-content duration-400 rounded-rounded-btn bg-base-content bg-base-content/10 text-base-content shadow-input  focus-visible:outline-hidden focus-visible:ring-base-content/40 flex h-10 w-full  border-none px-3 
          py-2 text-sm transition file:border-0 
          file:bg-transparent file:text-sm file:font-medium
           focus-visible:ring-2 
           disabled:cursor-not-allowed
           disabled:opacity-50 group-hover/input:shadow-none
           `,
            className,
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  },
)
Input.displayName = 'Input'

export { Input }

export const BottomGradient = () => {
  return (
    <>
      <span className='bg-linear-to-r absolute inset-x-0 -bottom-px block h-px w-full from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100' />
      <span className='bg-linear-to-r blur-xs absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 from-transparent via-indigo-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100' />
    </>
  )
}

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
      {children}
    </div>
  )
}
