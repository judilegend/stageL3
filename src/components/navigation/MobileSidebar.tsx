// MobileSidebar.tsx
"use client";

import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { AppSidebar } from "@/components/navigation/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ isOpen, onOpenChange }: MobileSidebarProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Button
        onClick={() => onOpenChange(true)}
        variant="ghost"
        size="icon"
        className="lg:hidden"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Ouvrir la navigation</span>
      </Button>

      <DialogContent className="fixed inset-0 z-50 p-0 bg-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <DialogTitle className="sr-only">Menu de navigation</DialogTitle>
        <Button
          className="absolute right-4 top-4"
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
        >
          <span className="sr-only">Fermer</span>
          <X className="h-4 w-4" />
        </Button>
        <AppSidebar className="h-full" />
      </DialogContent>
    </Dialog>
  );
}
