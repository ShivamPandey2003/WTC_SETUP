"use client";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/redux/store";

interface ProvidersProps {
  children: any;
}

export default function PersistProviders({ children }: ProvidersProps) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
