import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import TextCard from "@/v2_components/common/V2_Venue/TextCard";
import { useState } from "react";
import BG from "@/assets/Images/BG.jpg";
import MapText from "@/assets/Images/MapText.png";
import { Calendar, Navigation } from "lucide-react";
import Stage from '@/assets/Images/Stage.png'

const V2_Venue_page = () => {
  const [currentTab, setCurrentTab] = useState<string>("getting there");

  return (
    <div className="px-4 mx-auto">
      <div className="p-1 bg-white w-fit rounded-full flex gap-2 mb-4">
        <Button
          variant={currentTab === "getting there" ? "default" : "ghost"}
          className={cn("capitalize rounded-full p-2 w-[7rem]")}
          onClick={() => setCurrentTab("getting there")}
        >
          Getting There
        </Button>
        <Button
          variant={currentTab === "floor plan" ? "default" : "ghost"}
          className={cn("capitalize rounded-full p-2 w-[7rem]")}
          onClick={() => setCurrentTab("floor plan")}
        >
          floor Plan
        </Button>
      </div>
      {currentTab === "getting there" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="col-span-1 space-y-4">
            <TextCard />
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <img src={BG} alt="BG" className="w-full h-90 object-cover" />
            </div>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm p-6">
            <img
              src={MapText}
              alt="MapText"
              className="w-full h-[20rem] object-cover object-top mb-8"
            />
            <div className="h-1/2">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-6">
                  <Navigation strokeWidth={"1px"} />
                  <div>
                    <h3 className="text-lg font-bold">The Convention Hall</h3>
                    <p className="w-[15rem] text-sm">
                      1001 Pl. Jean-Paul-Riopelle, Montréal, QC H2Y 0A3, Canada
                    </p>
                  </div>
                </div>
                <Button className="rounded-full bg-[#E5F6DD] text-[#666666] hover:bg-[#c9fcb0] hover:text-[#555555] text-sm w-[9rem]">
                  Open in Maps
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-6">
                  <Calendar strokeWidth={"1px"} />
                  <div>
                    <h3 className="text-lg font-bold">
                      Jan 15 2026 - Jan 21 2026
                    </h3>
                    <p className="w-[15rem] text-sm">07:30 AM - 17:30 PM</p>
                  </div>
                </div>
                <Button className="rounded-full bg-[#E5F6DD] text-[#666666] hover:bg-[#c9fcb0] hover:text-[#555555] text-sm w-[9rem]">
                  Add to calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {
        currentTab === "floor plan" && <div className="w-full rounded-xl p-6 bg-white">
            <img src={Stage} alt="Stage" className="object-contain w-full h-[70vh]" />
        </div>
      }
    </div>
  );
};

export default V2_Venue_page;
