"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
import DayPicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date",
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
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
        <DayPicker value={value} onChange={onChange} />
        {/* <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setIsPopoverOpen(false);
          }}
          initialFocus
        /> */}
      </PopoverContent>
    </Popover>
  );
};
