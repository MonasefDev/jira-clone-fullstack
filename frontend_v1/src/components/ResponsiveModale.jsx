"use client";

import { useMedia } from "react-use";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

import { Drawer, DrawerContent } from "./ui/drawer";

export function ResponsiveModal({
  title = "title",
  open,
  onOpenChange,
  children,
}) {
  const isDesktop = useMedia("(min-width: 1024px)", true);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full lg:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <VisuallyHidden>
          <DialogTitle>create workspace</DialogTitle>
        </VisuallyHidden>
        <div className="overflow-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
