
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

const AspectRatio = forwardRef<
  ElementRef<typeof AspectRatioPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
    className?: string;
    loading?: 'eager' | 'lazy';
    imageStyles?: React.CSSProperties;
  }
>(({ className, style, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-md transition-all duration-300",
      className
    )}
    style={{
      ...style,
    }}
    {...props}
  />
))
AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
