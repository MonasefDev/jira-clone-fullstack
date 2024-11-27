import React from "react";
import { cn } from "@/lib/utils";

export function DottedSeparator({
  className,
  color = "#d4d4d8",
  height = "2px",
  dotSize = "2px",
  gapSize = "6px",
  direction = "horizontal",
}) {
  const isHorizontal = direction === "horizontal";
  return (
    <div
      className={cn(
        isHorizontal
          ? "w-full flex items-center"
          : "h-full flex flex-col items-center",
        className
      )}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${parseInt(dotSize) + parseInt(gapSize)}px 100%`
            : `100% ${parseInt(dotSize) * 2 + gapSize}px`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          bacckgroundPosition: "center",
        }}
      />
    </div>
  );
}