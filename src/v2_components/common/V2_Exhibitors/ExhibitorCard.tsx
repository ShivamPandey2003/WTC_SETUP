import ExPlaceholderImg from '@/assets/Images/EXPlaceholder.jpg'

interface ExhibitorCardProps {
  logo: string;
  full_name: string;
  booth_no?: string;
  url?: string;
  backgroundColor?: string;
  onClick: () => void;
}

export default function ExhibitorCard({
  logo,
  full_name,
  booth_no,
  onClick,
}: ExhibitorCardProps) {
  return (
    <div
      className={`rounded-lg bg-white overflow-hidden shadow-md border border-border w-[20rem] max-w-full sm:max-w-[17.5rem] md:max-w-xs cursor-pointer`}
      onClick={onClick}
    >
      <div
        className={`bg-gray-300 flex items-center justify-center h-32 overflow-hidden`}
      >
        <img
          src={logo??ExPlaceholderImg}
          alt={full_name}
          className="object-contain h-full w-full"
        />
      </div>

      <div className="bg-white p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">{full_name}</h3>

        {(booth_no && booth_no.trim()) && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">Booth #{booth_no}</p>
          </div>
        )}
      </div>
    </div>
  );
}
