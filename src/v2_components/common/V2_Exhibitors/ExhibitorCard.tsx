import { useState } from 'react'
import ExPlaceholderImg from '@/assets/Images/EXPlaceholder.jpg'

interface ExhibitorCardProps {
  logo: string;
  full_name: string;
  booth_no?: string;
  url?: string;
  backgroundColor?: string;
  onClick: () => void;
  colorTag: string;
}

export default function ExhibitorCard({
  logo,
  full_name,
  booth_no,
  onClick,
  colorTag
}: ExhibitorCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`rounded-lg overflow-hidden flex flex-col justify-between w-[20rem] max-w-full sm:max-w-70 md:max-w-xs cursor-pointer border transition-shadow duration-200`}
      style={{
        borderColor: hovered ? colorTag : '#e5e7eb',
        boxShadow: hovered ? `0 3px 10px 0 ${colorTag}55, 0 3px 10px 0 rgba(0,0,0,0.08)` : `0 1px 5px 0 ${colorTag}55, 0 1px 3px 0 rgba(0,0,0,0.08)`
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className={` flex items-center justify-center h-32 overflow-hidden p-2`}
      >
        <img
          src={logo??ExPlaceholderImg}
          alt={full_name}
          className="object-contain object-center h-full w-full"
        />
      </div>

      <div className="p-4 bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{full_name}</h3>

        {(booth_no && booth_no.trim()) && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">Booth #{booth_no}</p>
          </div>
        )}
      </div>
    </div>
  );
}
