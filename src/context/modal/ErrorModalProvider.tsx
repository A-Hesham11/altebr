// context/modal/ErrorModalProvider.tsx
import ModalError from "@/components/molecules/ModalError";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type Ctx = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

// default value prevents crashes before the provider mounts
const defaultCtx: Ctx = { open: () => {}, close: () => {}, isOpen: false };
const ErrorModalCtx = createContext<Ctx>(defaultCtx);

export const ErrorModalProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ErrorModalCtx.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && <ModalError />}
    </ErrorModalCtx.Provider>
  );
};

export const useErrorModal = () => useContext(ErrorModalCtx);
