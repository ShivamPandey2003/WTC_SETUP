interface ExhibitorCardProps {
  logo: string;
  companyName: string;
  boothNumber: string;
  websiteUrl?: string;
  backgroundColor?: string;
}

export default function ExhibitorCard({
  logo,
  companyName,
  boothNumber,
  websiteUrl,
  // backgroundColor = "bg-amber-400",
}: ExhibitorCardProps) {
  return (
    <div
      className={`rounded-lg overflow-hidden shadow-md border border-border w-[20rem] max-w-full sm:max-w-[17.5rem] md:max-w-xs`}
    >
      <div
        className={`bg-gray-300 p-8 flex items-center justify-center min-h-32`}
      >
        <img src={logo} alt={companyName} className="h-12 object-contain" />
      </div>

      <div className="bg-white p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{companyName}</h3>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">Booth {boothNumber}</p>

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
