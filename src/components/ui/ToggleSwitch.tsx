import React from "react";

const ToggleSwitch = () => {
  const [isOn, setIsOn] = React.useState(false);

  return (
    <div
      onClick={() => setIsOn(!isOn)}
      className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${
        isOn ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default ToggleSwitch
