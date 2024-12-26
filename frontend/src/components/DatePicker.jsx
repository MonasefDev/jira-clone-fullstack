"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "./ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date",
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  React.useEffect(() => {
    if (isPopoverOpen) setIsPopoverOpen(false);
  }, [onChange]);
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DayPicker onDayClick={onChange} modifiers={{ selected: value }} />
      </PopoverContent>
    </Popover>
  );
};
