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
      className={`rounded-lg overflow-hidden flex flex-col justify-between shadow-sm w-[20rem] max-w-full sm:max-w-[17.5rem] md:max-w-xs cursor-pointer hover:shadow-xl border border-gray-200 hover:border-gray-300`}
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

      <div className="from-transparent to-white bg-linear-to-b p-4">
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
