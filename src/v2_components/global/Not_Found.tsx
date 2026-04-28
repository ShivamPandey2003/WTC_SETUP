import { Calendar, Home, Users } from "lucide-react";
import { useNavigate } from "react-router";

const Not_Found = () => {
  const navigation = useNavigate();

  return (
    <main className="flex-1 p-6 flex flex-col items-center justify-center">
      {/* Hero 404 card */}
      <div className="w-full max-w-3xl mb-6">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 aspect-[16/7] flex items-center justify-center shadow-sm">
          {/* Tunnel illustration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute border-2 border-gray-600 rounded-full"
                style={{
                  width: `${i * 18}%`,
                  height: `${i * 18}%`,
                }}
              />
            ))}
          </div>

          {/* Content overlay */}
          <div className="relative z-10 text-center px-8">
            <div
              className="text-white font-black leading-none mb-2"
              style={{ fontSize: "clamp(80px, 15vw, 140px)" }}
            >
              404
            </div>
            <div className="text-white/90 text-lg font-semibold tracking-wide mb-1">
              This tunnel leads nowhere
            </div>
            <div className="text-white/70 text-sm">
              The page you're looking for has collapsed or never existed.
            </div>
          </div>

          {/* Bottom left label like the speaker card */}
          <div className="absolute bottom-5 left-6 text-left">
            <div className="text-white font-bold text-xl drop-shadow">
              Page Missing
            </div>
            <div className="text-white/80 text-sm">Error 404 — Not Found</div>
          </div>
        </div>
      </div>

      {/* Bottom row cards */}
      <div className="w-full max-w-3xl grid grid-cols-3 gap-4 ">
        {/* Go Home card */}
        <div
          onClick={() => {
            navigation("/");
          }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="relative h-28 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <div className="absolute -top-1 -left-1">
              <div className="relative">
                <div
                  className="bg-green-700 text-white text-[10px] font-black px-3 py-1.5 leading-none"
                  style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)" }}
                >
                  QUICK
                  <br />
                  LINK
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[6px] border-l-green-900 border-b-[6px] border-b-transparent" />
              </div>
            </div>
            <Home
              size={32}
              className="text-white/90 group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-gray-800 mb-1">
              Return Home
            </div>
            <div className="text-xs text-gray-500 leading-snug">
              Head back to the WTC2026 homepage and explore conference content.
            </div>
          </div>
        </div>

        {/* Programmes card */}
        <div
          onClick={() => {
            navigation("/programme");
          }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="relative h-28 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="absolute -top-1 -left-1">
              <div className="relative">
                <div
                  className="bg-green-700 text-white text-[10px] font-black px-3 py-1.5 leading-none"
                  style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)" }}
                >
                  QUICK
                  <br />
                  LINK
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[6px] border-l-green-900 border-b-[6px] border-b-transparent" />
              </div>
            </div>
            <Calendar
              size={32}
              className="text-white/80 group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-gray-800 mb-1">
              View Programmes
            </div>
            <div className="text-xs text-gray-500 leading-snug">
              Browse the full technical programme and session schedule.
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            navigation("/speaker");
          }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="relative h-28 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="absolute -top-1 -left-1">
              <div className="relative">
                <div
                  className="bg-green-700 text-white text-[10px] font-black px-3 py-1.5 leading-none"
                  style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)" }}
                >
                  QUICK
                  <br />
                  LINK
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[6px] border-l-green-900 border-b-[6px] border-b-transparent" />
              </div>
            </div>
            <Users
              size={32}
              className="text-white/80 group-hover:scale-110 transition-transform"
            />
          </div>
          <div className="p-3">
            <div className="text-sm font-bold text-gray-800 mb-1">
              View Speakers
            </div>
            <div className="text-xs text-gray-500 leading-snug">
              Browse the full speaker lineup.
            </div>
          </div>
        </div>
      </div>

      {/* Hint text */}
      <p className="mt-6 text-xs text-gray-400 text-center">
        If you believe this is a mistake, please contact the WTC2026 web team.
      </p>
    </main>
  );
};

export default Not_Found;
