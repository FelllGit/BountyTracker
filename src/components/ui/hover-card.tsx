"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";
import { ReactElement, useState } from "react";

const HoverCard = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>) => {
  const [open, setOpen] = useState(false);

  return (
    <HoverCardPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === HoverCardTrigger) {
          return React.cloneElement(child as ReactElement, {
            open,
            setOpen,
          });
        }
        return child;
      })}
    </HoverCardPrimitive.Root>
  );
};

const HoverCardTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    asChild?: boolean;
  }
>(({ className, open, setOpen, asChild = false, children, ...props }, ref) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (setOpen) {
      setOpen(!open);
    }
  };

  const triggerContent = (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      aria-expanded={open}
      {...props}
    >
      {children}
    </button>
  );

  return asChild ? (
    <HoverCardPrimitive.Trigger asChild>
      {triggerContent}
    </HoverCardPrimitive.Trigger>
  ) : (
    <HoverCardPrimitive.Trigger asChild>
      {triggerContent}
    </HoverCardPrimitive.Trigger>
  );
});
HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-hover-card-content-transform-origin]",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
