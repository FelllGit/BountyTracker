"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  startDate: Date | undefined;
  endDate?: Date | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  mode?: "range" | "single";
}

const DatePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  mode = "range",
}) => {
  const setDate = (range: DateRange | undefined) => {
    if (range && setEndDate) {
      setStartDate(range.from);
      setEndDate(range.to);
    }
  };

  const clearAll = () => {
    setStartDate(undefined);
    if (setEndDate) setEndDate(undefined);
  };

  const clearEndDate = () => {
    if (setEndDate) setEndDate(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal h-10 w-56",
            (!startDate || !endDate) && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 scale-125" color="grey" />
          {startDate ? (
            <span>
              {format(startDate, "yyyy-MM-dd")}
              {endDate && " / " + format(endDate, "yyyy-MM-dd")}
            </span>
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-3">
          {mode === "range" ? (
            <Calendar
              mode="range"
              selected={{ from: startDate, to: endDate }}
              onSelect={setDate}
              initialFocus
              className="rounded-md border"
            />
          ) : (
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              className="rounded-md border"
            />
          )}
          <div className="mt-4 flex justify-end space-x-2">
            {mode === "range" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearEndDate}
                  disabled={!endDate}
                >
                  Clear end date
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  disabled={!startDate && !endDate}
                >
                  Clear all
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  disabled={!startDate}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
