import EventCard1 from "@/components/common/Programme/EventCard1";
import EventCard2 from "@/components/common/Programme/EventCard2";
import { EventCard3 } from "@/components/common/Programme/EventCard3";
import EventModal from "@/components/common/Programme/EventModal";
import Titlabar from "@/components/global/Titlabar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Events from "@/data/Events";
import { getDatesInRangeFormatted } from "@/lib/utils";
import { useState } from "react";

const Programme_page = () => {
  const Dates = getDatesInRangeFormatted("04-02-2026", "04-07-2026");
  const [selected, setSelected] = useState<string | null>(null);
  const [selected1, setSelected1] = useState<string | null>(null);

  return (
    <div className="mx-[7.5%]">
      <Titlabar className="mb-8" />
      <Tabs
        defaultValue={Dates[0]}
        className="w-[300px] xxxs:w-[350px] xxs:w-[400px] ss:w-[100%]"
      >
        <TabsList className="mb-4 pl-80 xxs:pl-60 xs:pl-0">
          {Dates.map((date) => (
            <TabsTrigger key={date} value={date}>
              {date}
            </TabsTrigger>
          ))}
        </TabsList>
        {Dates.map((date) => {
          if (date === "Apr 03, 2026") {
            return (
              <TabsContent key={date} value={date} className="md:mx-auto">
                {Events.map((data, index) => {
                  return (
                    <EventCard2
                      key={index}
                      {...data}
                      isFirst={index === 0}
                      isLast={index === Events.length - 1}
                      selected={selected1}
                      setSeleced={setSelected1}
                    />
                  );
                })}
              </TabsContent>
            );
          }

          if (date === "Apr 04, 2026") {
            return (
              <TabsContent key={date} value={date} className="md:mx-auto">
                {Events.map((data, index) => {
                  return (
                    <EventCard3
                      key={index}
                      {...data}
                      isFirst={index === 0}
                      isLast={index === Events.length - 1}
                      selected={selected1}
                      setSeleced={setSelected1}
                    />
                  );
                })}
              </TabsContent>
            );
          }

          return (
            <TabsContent key={date} value={date} className="md:mx-auto">
              {Events.map((data, index) => {
                return (
                  <EventCard1
                    key={index}
                    {...data}
                    isFirst={index === 0}
                    isLast={index === Events.length - 1}
                    setSeleced={setSelected}
                  />
                );
              })}
            </TabsContent>
          );
        })}
      </Tabs>
      <EventModal
        isOpen={typeof selected === "string"}
        onClose={setSelected}
        id={selected as string}
      />
    </div>
  );
};

export default Programme_page;
