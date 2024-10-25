import React, { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputProps } from "@/components/ui/input";
import Icon from "@/components/icon/icon";

type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  icon?: string;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, value, onChange, icon, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft =
          scrollContainerRef.current.scrollWidth;
      }
    }, [value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div className={cn("relative w-full", className)}>
        {icon && (
          <Icon
            name={icon}
            className="absolute left-3 top-[18px] h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
          />
        )}
        <div
          className={cn(
            "flex items-center h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background",
            "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
            icon && "pl-10"
          )}
        >
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full h-full"
          >
            {value.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="bg-gray-200 text-gray-700 whitespace-nowrap flex-shrink-0"
              >
                {item}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            <input
              ref={inputRef}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[70px] h-full"
              value={pendingDataPoint}
              onChange={(e) => setPendingDataPoint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addPendingDataPoint();
                } else if (
                  e.key === "Backspace" &&
                  pendingDataPoint.length === 0 &&
                  value.length > 0
                ) {
                  e.preventDefault();
                  onChange(value.slice(0, -1));
                }
              }}
              {...props}
            />
          </div>
        </div>
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
