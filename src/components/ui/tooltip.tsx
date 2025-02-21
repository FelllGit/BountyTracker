"use client";

import { forwardRef, useState, useCallback, type ReactNode } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

interface TooltipProps {
  children: ReactNode;
  defaultOpen?: boolean;
  delayDuration?: number;
}

const Tooltip = ({
  children,
  defaultOpen = false,
  delayDuration = 0, // Remove delay for mobile
  ...props
}: TooltipProps & TooltipPrimitive.TooltipProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <TooltipPrimitive.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      delayDuration={delayDuration}
      {...props}
    >
      {children}
    </TooltipPrimitive.Root>
  );
};

interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  asChild?: boolean;
}

const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ asChild = true, className, ...props }, ref) => {
    return (
      <TooltipPrimitive.Trigger
        ref={ref}
        asChild={asChild}
        className={cn("cursor-default", className)}
        {...props}
      />
    );
  }
);
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  className?: string;
  sideOffset?: number;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
