import React from "react";

interface ColorPickerProps {
  label: string;
  color: string;
  description?: string;
  onChange?: (color: string) => void;
}

export default function ColorPicker({ label, color, description, onChange }: ColorPickerProps) {
    const [hexValue, setHexValue] = React.useState(color);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexValue(newColor);
    onChange?.(newColor);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    setHexValue(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange?.(value);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input type="color" className="" value={hexValue} onChange={handleColorChange}/>
        <input
          type="text"
          value={hexValue}
          onChange={handleHexInput}
          className="px-3 py-1.5 text-sm text-gray-700 rounded focus:outline-none focus:ring-0 focus:border-transparent"
          placeholder="#000000"
        />
      </div>
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
