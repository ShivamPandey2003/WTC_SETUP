import { cn } from "@/lib/utils";
import React from "react";

type ToggleSwitchProp = {
  isOpen: boolean;
  setIsOn: () => void;
  disable?: boolean;
};

const ToggleSwitch: React.FC<ToggleSwitchProp> = ({
  isOpen,
  setIsOn,
  disable,
}) => {
  return (
    <div
      onClick={() => {
        if (disable) return;
        setIsOn();
      }}
      className={cn(
        "w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition-colors",
        isOpen ? "bg-primary" : "bg-gray-300",
        disable ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
          isOpen ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
