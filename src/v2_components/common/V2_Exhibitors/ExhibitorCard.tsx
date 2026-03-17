import ExPlaceholderImg from '@/assets/Images/EXPlaceholder.jpg'

interface ExhibitorCardProps {
  logo: string;
  full_name: string;
  // boothNumber: string;
  url?: string;
  backgroundColor?: string;
  onClick: () => void;
}

export default function ExhibitorCard({
  logo,
  full_name,
  // boothNumber,
  onClick,
}: ExhibitorCardProps) {
  return (
    <div
      className={`rounded-lg bg-white overflow-hidden shadow-md border border-border w-[20rem] max-w-full sm:max-w-[17.5rem] md:max-w-xs cursor-pointer`}
      onClick={onClick}
    >
      <div
        className={`bg-gray-300 p-8 flex items-center justify-center min-h-32`}
      >
        <img
          src={logo??ExPlaceholderImg}
          alt={full_name}
          className="h-12 object-contain"
        />
      </div>

      <div className="bg-white p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{full_name}</h3>

        {/* <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">Booth Hall C · Booth 21</p>
        </div> */}
      </div>
    </div>
  );
}
