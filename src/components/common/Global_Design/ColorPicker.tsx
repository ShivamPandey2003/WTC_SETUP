interface ColorPickerProps {
  label: string;
  color: string;
  description?: string;
}

export default function ColorPicker({ label, color, description }: ColorPickerProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div
          className="w-6 h-6 rounded border border-gray-300"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-gray-600">{color}</span>
      </div>
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
