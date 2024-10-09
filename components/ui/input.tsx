import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "relative w-full text-sm dark:text-neutral-200 bg-white dark:bg-neutral-750 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 px-3.5 py-2 rounded-lg border border-black/5 shadow-input shadow-black/5 dark:shadow-black/10 !outline-none",
          "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:ring-1 focus-visible:ring-blue-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }