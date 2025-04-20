
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useTemplateTheme } from "@/context/TemplateThemeContext"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#1A1F2C] text-white hover:bg-[#2A2F3C] shadow-lg",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg",
        outline: "border-2 border-[#1A1F2C] bg-transparent hover:bg-[#1A1F2C] hover:text-white text-[#1A1F2C] shadow-sm",
        secondary: "bg-[#2A2F3C] text-white hover:bg-[#3A3F4C] shadow-lg",
        ghost: "hover:bg-[#2A2F3C] hover:text-white",
        link: "text-[#1A1F2C] underline-offset-4 hover:underline",
        cta: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg font-semibold tracking-wide",
        "cta-outline": "border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white shadow-sm font-semibold tracking-wide",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
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
    
    const buttonClass = className?.includes("bg-") 
      ? className 
      : cn(buttonVariants({ variant, size }), className);
    
    return (
      <Comp
        className={buttonClass}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
