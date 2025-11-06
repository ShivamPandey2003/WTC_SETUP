import React from "react";

type ToggleSwitchProp = {
  isOpen: boolean,
  setIsOn:()=>void
}

const ToggleSwitch:React.FC<ToggleSwitchProp> = ({isOpen, setIsOn}) => {
  return (
    <div
      onClick={setIsOn}
      className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${
        isOpen ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
          isOpen ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default ToggleSwitch
