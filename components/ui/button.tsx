import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold leading-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-rose-600 via-red-500 to-orange-400 text-white shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 hover:shadow-rose-500/50 hover:scale-[1.02]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-white/15 bg-white/5 text-rose-200 hover:border-rose-400/60 hover:text-white",
        secondary:
          "border border-rose-400/40 bg-transparent text-rose-200 hover:border-rose-400 hover:text-white",
        ghost: "hover:bg-white/5 hover:text-rose-200",
        link: "text-rose-300 underline-offset-4 hover:underline hover:text-white",
      },
      size: {
        default: "h-11 px-7 text-sm sm:h-12 sm:px-10",
        sm: "h-9 px-5 text-xs sm:h-10 sm:px-6",
        lg: "h-12 px-9 text-base sm:h-14 sm:px-12",
        icon: "h-11 w-11 sm:h-12 sm:w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
