interface AdCardProps {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function AdCard({ title, subtitle, image, buttonText, onButtonClick }: AdCardProps) {
  return (
    <div className="relative w-full h-full min-h-[200px] rounded-xl overflow-hidden group">
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-white/90 mb-4">{subtitle}</p>
          <button
            onClick={onButtonClick}
            className="bg-white/90 hover:bg-white text-slate-800 font-semibold px-6 py-2 rounded-full w-fit transition-colors duration-200"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
