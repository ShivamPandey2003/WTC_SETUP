import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import dummy from "@/assets/Images/Dummy.png";
import type { RootState } from "@/redux/store";
import {
  FileText,
  Menu,
  X,
  CalendarArrowDown,
  BellDot,
  MapPin,
  Calendar1,
  Clock,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { addToGoogleCalendar, cn, formatForGoogleCalendar } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useNotifyProgramme } from "@/api/programme_design_api/Programme_design_api";
import Description from "@/components/ui/Description";
import { useIsMobile } from "@/hooks/use-mobile";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  data: { id: string; date: string };
};

const EventModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const { Session } = useSelector((state: RootState) => state.Global_Slice);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { notify, isPending } = useNotifyProgramme();
  const [menuBar, setMenuBar] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const selectedValue = Session.filter(
    (pre) => data.date === pre.start_date,
  ).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const [value, setValue] = React.useState<string>("");

  console.log(selectedValue);

  const navigate = useNavigate();

  // const { date, start, end } = useMemo(() => {
  //   if (!value.trim() || !Array.isArray(selectedValue))
  //     return { date: "", start: "", end: "" };
  //   const newValue = selectedValue.find((pre) => pre.id === value);
  //   if (!newValue) return { date: "", start: "", end: "" };

  //   return {
  //     date: newValue.start_date,
  //     start: newValue.start_time,
  //     end: newValue.end_time,
  //   };
  // }, [value]);

  React.useEffect(() => {
    if (data.id) {
      setValue(data.id);
    }
  }, [data]);

  React.useEffect(() => {
    const el = tabRefs.current[data.id];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "start", // vertical scroll
    });
  }, [data.id]);

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size={"full"}
      showCloseButton
      classname="overflow-hidden custom-scrollbar"
    >
      {!selectedValue ? (
        <div>No such data found</div>
      ) : (
        // !Array.isArray(selectedValue) ? (
        //   <div className="w-full overflow-auto max-h-[70vh] custom-scrollbar">
        //     {eventCategory !== selectedValue. && (
        //       <div className="title text-primary mb-3">{eventCategory}</div>
        //     )}
        //     <div className="flex flex-col sm:flex-row gap-5 items-center">
        //       <div className="flex items-center justify-center h-full">
        //         <img
        //           src={selectedValue.bg_image ? selectedValue.bg_image : dummy}
        //           alt={selectedValue.title}
        //           className="w-full sm:w-[200px] h-[118px] rounded-lg object-cover opacity-80"
        //         />
        //       </div>
        //       <div className="flex flex-col justify-between h-full gap-3">
        //         <h2 className="text-xl font-bold text-primary mb-2">
        //           {selectedValue.title}
        //         </h2>
        //         <div className="flex gap-5 text-sm items-center">
        //           <div className="text-sm text-primary font-semibold flex items-center gap-1">
        //             <Calendar1 size={17} />{" "}
        //             {selectedValue.start_date === selectedValue.end_date
        //               ? selectedValue.start_date
        //               : `${selectedValue.start_date} - ${selectedValue.end_date}`}
        //           </div>
        //           <div className="flex text-sm text-primary font-semibold gap-1 items-center">
        //             <Clock size={17} />{" "}
        //             {`${selectedValue.start_time} - ${selectedValue.end_time}`}
        //           </div>
        //         </div>
        //         {selectedValue.venue && (
        //           <Button
        //             onClick={() =>
        //               navigate(
        //                 `/venue?id=${selectedValue.venue.designId}&venueid=${selectedValue.venue.id}`,
        //               )
        //             }
        //             variant={"link"}
        //             size={"sm"}
        //             className="p-0 ml-4"
        //           >
        //             Room no: {selectedValue.venue.design_label} -{" "}
        //             {selectedValue.venue.name}
        //           </Button>
        //         )}
        //         <button
        //           onClick={() => onClose(null)}
        //           className="absolute hover:cursor-pointer top-3 right-3 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
        //           aria-label="Close"
        //         >
        //           <X className="w-4 h-4 text-gray-700 font-semibold" />
        //         </button>
        //         <div className="flex flex-col w-full items-start">
        //           <Button variant={"link"} size={"sm"} className="p-0!">
        //             <MapPin /> {selectedValue.location}
        //           </Button>
        //           <div className="flex w-full gap-5">
        //             <Button
        //               onClick={() =>
        //                 addToGoogleCalendar({
        //                   title: selectedValue.title,
        //                   start: formatForGoogleCalendar(
        //                     selectedValue.start_date,
        //                     selectedValue.start_time,
        //                   ),
        //                   end: formatForGoogleCalendar(
        //                     selectedValue.end_date,
        //                     selectedValue.end_time,
        //                   ),
        //                   location: selectedValue.location,
        //                 })
        //               }
        //               variant={"link"}
        //               size={"sm"}
        //               className="p-0!"
        //             >
        //               <CalendarArrowDown /> Add to calendar
        //             </Button>
        //             <Button
        //               variant={"link"}
        //               size={"sm"}
        //               className="p-0!"
        //               onClick={() => notify({ id: selectedValue.id })}
        //               disabled={isPending}
        //             >
        //               <BellDot /> Notify me
        //             </Button>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //     <div className="relative">
        //       <p className="text-sm text-gray-600 leading-relaxed mb-4">
        //         {selectedValue.description}
        //       </p>

        //       {
        //         selectedValue.attachments &&
        //           selectedValue.attachments.length > 0 &&
        //           // <a href={selectedValue.attachments.file} target="_blank">
        //           selectedValue.attachments
        //             .filter((p) => p.has_attachment)
        //             .map((e) => (
        //               <div
        //                 key={e.id}
        //                 onClick={() =>
        //                   navigate(`/Attachment/${selectedValue.id}`, {
        //                     state: { Title: e.filename, file_id: e.id },
        //                   })
        //                 }
        //                 className="flex flex-col sm:flex-row sm:items-center gap-2 mb-5 text-sm text-gray-700"
        //               >
        //                 <FileText className="w-4 h-4" />
        //                 <span className="hover:underline cursor-pointer">
        //                   {e.filename}
        //                 </span>
        //               </div>
        //             ))
        //         // </a>
        //       }

        //       <div className="flex items-center gap-6">
        //         {selectedValue.speakers.map((speaker, index) => (
        //           <div
        //             key={index}
        //             className="flex flex-col items-center cursor-pointer"
        //             onClick={() => navigate(`/speaker/${speaker.speaker_id}`)}
        //           >
        //             <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-2 overflow-hidden">
        //               {speaker.profile_img ? (
        //                 <img
        //                   src={speaker.profile_img}
        //                   alt={speaker.fullname}
        //                   className="w-full h-full object-cover"
        //                 />
        //               ) : (
        //                 <svg
        //                   className="w-6 h-6 text-white"
        //                   fill="currentColor"
        //                   viewBox="0 0 24 24"
        //                 >
        //                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        //                 </svg>
        //               )}
        //             </div>
        //             <span className="text-xs text-gray-700 text-center">
        //               {speaker.fullname}
        //             </span>
        //           </div>
        //         ))}
        //       </div>
        //     </div>
        //   </div>
        // ) :
        <div className="w-full sm:min-h-[300px]">
          <div className="flex flex-col sm:flex-row sm:items-center w-full sm:gap-8">
            <div className="flex items-center gap-4">
              {!menuBar ? (
                <Menu
                  className="sm:hidden bg-gray-200 rounded-sm p-0.5"
                  onClick={() => setMenuBar((pre) => !pre)}
                />
              ) : (
                <X
                  className="sm:hidden bg-gray-200 rounded-sm p-0.5"
                  onClick={() => setMenuBar((pre) => !pre)}
                />
              )}
              <p className="text-2xl sm:mb-4 font-bold text-primary">
                Day View
              </p>
            </div>
            <p className="text-lg sm:text-2xl mb-4 font-bold text-primary">
              {data.date}
            </p>
          </div>
          <Tabs
            defaultValue={data.id}
            value={value}
            onValueChange={setValue}
            className="flex flex-row"
          >
            {menuBar && isMobile && (
              <TabsList
                ref={listRef}
                className="flex-col items-start rounded-none border-r border-gray-300 min-h-[300px] sm:w-[30%] h-full justify-start gap-4 pr-2 overflow-y-auto max-h-[52vh] sm:max-h-[70vh]"
              >
                <span className="text-lg font-semibold text-gray-400">
                  Programme
                </span>
                {selectedValue.map((value) => (
                  <TabsTrigger
                    ref={(el) => {
                      tabRefs.current[value.id] = el;
                    }}
                    key={value.id}
                    variant={"filled"}
                    value={value.id}
                    className={cn(
                      "font-semibold w-full data-[active=false]:bg-gray-100 px-2 data-[active=true]:border-gray-200 data-[active=true]:shadow data-[active=true]:no-underline flex-col items-start",
                    )}
                  >
                    <span>{`${value.start_time.slice(0, 5)} - ${value.end_time.slice(0, 5)}`}</span>
                    <p className="line-clamp-2 whitespace-normal text-start">
                      {value.title}
                    </p>
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            <TabsList
              ref={listRef}
              className="flex-col hidden sm:flex items-start rounded-none border-r border-gray-300 min-h-[300px] sm:w-[30%] h-full justify-start gap-4 pr-2 overflow-y-auto max-h-[52vh] sm:max-h-[70vh]"
            >
              <span className="text-lg font-semibold text-gray-400">
                Programme
              </span>
              {selectedValue.map((value) => (
                <TabsTrigger
                  ref={(el) => {
                    tabRefs.current[value.id] = el;
                  }}
                  key={value.id}
                  variant={"filled"}
                  value={value.id}
                  className={cn(
                    "font-semibold w-full data-[active=false]:bg-gray-100 px-2 data-[active=true]:border-gray-200 data-[active=true]:shadow data-[active=true]:no-underline flex-col items-start",
                  )}
                >
                  <span>{`${value.start_time.slice(0, 5)} - ${value.end_time.slice(0, 5)}`}</span>
                  <div className="line-clamp-2 whitespace-normal text-start truncate">
                    {value.title}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedValue.map((s) => (
              <TabsContent
                value={s.id}
                className="overflow-y-auto max-h-[52vh] sm:max-h-[70vh] custom-scrollbar pb-2"
                key={s.id}
              >
                <div className="flex flex-col items-start gap-4 mb-2 px-4 pb-4">
                  {Object.entries(s.categories).map(([_, value]) => (
                    <p style={{ color: value.color }} className="font-semibold">
                      {value.name}
                    </p>
                  ))}
                  <div className="flex items-center justify-start w-full">
                    <img
                      src={s.bg_image ? s.bg_image : dummy}
                      alt={s.title}
                      className="w-full sm:w-[200px] h-[118px] rounded-lg object-cover opacity-80"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                      {s.title}
                    </h2>
                    <div className="flex gap-5">
                      <div className="flex items-center gap-1 text-sm text-primary font-semibold mb-1">
                        <Calendar1 size={17} /> {`${s.start_date}`}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-primary font-semibold mb-1">
                        <Clock size={17} /> {`${s.start_time} - ${s.end_time}`}
                      </div>
                    </div>
                    <div className="flex flex-start">
                      <Button variant={"link"} size={"sm"} className="p-0!">
                        <MapPin /> {s.location}
                      </Button>
                    </div>
                    {s.venue && (
                      <Button
                        onClick={() => navigate(`/venue?id=${s.venue.id}`)}
                        variant={"link"}
                        size={"sm"}
                        className="p-0! ml-4"
                      >
                        Room no: {s.venue.name}
                      </Button>
                    )}
                    <button
                      onClick={() => onClose(null)}
                      className="absolute top-3 hover:cursor-pointer right-3 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 text-gray-700 font-semibold" />
                    </button>
                    <div className="flex gap-3 mb-5">
                      <Button
                        onClick={() =>
                          addToGoogleCalendar({
                            title: s.title,
                            start: formatForGoogleCalendar(
                              s.start_date,
                              s.start_time,
                            ),
                            end: formatForGoogleCalendar(
                              s.end_date,
                              s.end_time,
                            ),
                            location: s.location,
                          })
                        }
                        variant={"link"}
                        size={"sm"}
                        className="p-0!"
                      >
                        <CalendarArrowDown /> Add to calendar
                      </Button>
                      <Button
                        variant={"link"}
                        size={"sm"}
                        className="p-0!"
                        onClick={() => notify({ id: s.id })}
                        disabled={isPending}
                      >
                        <BellDot /> Notify me
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Description text={s.description} />
                  {/* <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {}
                  </p> */}
                  {
                    s.attachments &&
                      s.attachments.length > 0 &&
                      // <a href={s.attachments.file} target="_blank">
                      s.attachments
                        .filter((p) => p.has_attachment)
                        .map((e) => (
                          <div
                            onClick={() =>
                              navigate(`/Attachment/${s.id}`, {
                                state: { Title: e.filename, file_id: e.id },
                              })
                            }
                            className="flex flex-col sm:flex-row items-center gap-2 mb-5 text-sm text-gray-700"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="hover:underline cursor-pointer">
                              {e.filename}
                            </span>
                          </div>
                        ))

                    // </a>
                  }

                  <div className="flex items-center gap-6 mt-4">
                    {s.speakers.map((speaker, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-2 overflow-hidden">
                          {!speaker ? (
                            <img
                              src={speaker}
                              alt={speaker}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-700 text-center">
                          {speaker.fullname}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </Modal>
  );
};

export default EventModal;
