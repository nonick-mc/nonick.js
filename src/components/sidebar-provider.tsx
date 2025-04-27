'use client';

import { useDisclosure } from '@heroui/use-disclosure';
import { type ReactNode, createContext } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onOpenChange: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <SidebarContext value={{ isOpen, onOpen, onClose, onOpenChange }}>{children}</SidebarContext>
  );
}
