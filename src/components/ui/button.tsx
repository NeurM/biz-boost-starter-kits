
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useTemplateTheme } from "@/context/TemplateThemeContext"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        dynamic: "bg-primary text-primary-foreground hover:bg-primary/90",
        "dynamic-secondary": "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Add new variants for CTA buttons
        "cta": "bg-blue-600 text-white hover:bg-blue-700",
        "cta-outline": "border-2 border-current bg-transparent hover:bg-white/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
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
    const { colorClasses, templateType } = useTemplateTheme();
    
    // Dynamic variant handling for template colors
    let dynamicClass = '';
    if (variant === 'dynamic' && templateType !== 'cleanslate') {
      dynamicClass = `${colorClasses.bg} ${colorClasses.hover} text-white`;
    } else if (variant === 'dynamic-secondary' && templateType !== 'cleanslate') {
      dynamicClass = `${colorClasses.secondaryBg} ${colorClasses.secondaryHover} text-white`;
    }
    
    // Use alternative styling for cleanslate template
    if ((variant === 'dynamic' || variant === 'dynamic-secondary') && templateType === 'cleanslate') {
      variant = 'default';
    }
    
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), dynamicClass)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
