import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-muted",
        success: "bg-success/20",
        cognitive: "bg-muted/50",
      },
      size: {
        default: "h-3",
        sm: "h-2",
        lg: "h-4",
        xl: "h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const indicatorVariants = cva(
  "h-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-success",
        cognitive: "bg-gradient-to-r from-primary to-primary-glow",
        visual: "bg-cognitive-visual",
        auditory: "bg-cognitive-auditory",
        reading: "bg-cognitive-reading",
        kinesthetic: "bg-cognitive-kinesthetic",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorVariant?: VariantProps<typeof indicatorVariants>["variant"];
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, indicatorVariant, animated = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        indicatorVariants({ variant: indicatorVariant || "default" }),
        animated && "progress-animate"
      )}
      style={{ width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
