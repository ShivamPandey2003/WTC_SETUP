import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import dummy from "@/assets/Images/Dummy.png";
import type { RootState } from "@/redux/store";
import {
  FileText,
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
import SingleSelect from "@/v2_components/global/SingleSelect";
import NoData from "@/components/global/NoData";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  data: { id: string; date: string };
};

const EventModal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
  const { Session, Types } = useSelector(
    (state: RootState) => state.Global_Slice,
  );
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { notify, isPending } = useNotifyProgramme();
  const isMobile = useIsMobile();
  const [type, setType] = useState<string | null>(null);

  const selectedValue = React.useMemo(() => {
    return Session.filter(
      (pre) => data.date === pre.start_date && type === pre.type,
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [Session, data.date, type]);

  const [value, setValue] = React.useState<string>("");

  const navigate = useNavigate();

  const ScrollWindow = (id: string) => {
    const el = tabRefs.current[id];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "start", // vertical scroll
    });
  };

  React.useEffect(() => {
    if (data.id) {
      setValue(data.id);
      const type = Session.find((pre) => pre.id === data.id)?.type;
      if (type) {
        setType(type);
      }
    }
  }, [data]);

  React.useEffect(() => {
    if (!value.trim() && selectedValue.length > 0) {
      let id = selectedValue[0].id;
      setValue(id);
      ScrollWindow(id);
    }
  }, [value, selectedValue]);

  React.useEffect(() => {
    const el = tabRefs.current[data.id];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "start", // vertical scroll
    });
  }, [data.id, selectedValue]);

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size={isMobile ? "lg" : "full"}
      showCloseButton
      classname="overflow-hidden custom-scrollbar p-2 sm:p-4"
    >
      {!selectedValue ? (
        <div>No data found</div>
      ) : (
        <div className="w-full min-h-[400px] sm:min-h-[350px]">
          <div className="flex flex-row items-end sm:items-center w-full gap-4 mb-2">
            <p className="text-lg sm:text-xl font-bold text-primary">
              Day View - {data.date}
            </p>
          </div>
          <div className="flex items-center gap-5 mb-2 overflow-x-auto max-w-[100%] custom-scrollbar">
            {[...Types].sort((a, b) => a.localeCompare(b)).map((item) => (
              <div
                className={cn("cursor-pointer capitalize font-semibold min-w-fit",type === item ? "border-b text-primary": "text-gray-500")}
                onClick={() => {
                  setType(item);
                  setValue("");
                }}
              >
                {item}
              </div>
            ))}
          </div>
          {isMobile && (
            <div className="mb-2">
              <div className="truncate text-sm font-semibold ml-1 mb-1">
                Programme Type
              </div>
              <SingleSelect
                onChange={(e) => {
                  setType(e);
                  setValue("");
                }}
                selected={type}
                placeholder="Search type..."
                options={Types.map((item) => ({
                  label: item,
                  value: item,
                }))}
                className="w-full sm:w-[23vw]"
              />
            </div>
          )}
          {isMobile && (
            <div>
              <div className="truncate text-sm font-semibold ml-1 mb-1">
                Programme
              </div>
              <SingleSelect
                selected={value}
                onChange={(e) => setValue(e as string)}
                options={selectedValue.map((item) => ({
                  label: item.title,
                  value: item.id,
                }))}
                className="w-full mb-2"
              />
            </div>
          )}
          <Tabs
            defaultValue={data.id}
            value={value}
            onValueChange={setValue}
            className="flex flex-row"
          >
            <TabsList
              ref={listRef}
              className="flex-col hidden sm:flex items-start rounded-none border-r border-gray-300 min-h-[300px] sm:w-[30%] h-full justify-start gap-4 pr-2 overflow-y-auto max-h-[52vh] sm:max-h-[59vh]"
            >
              <div className="sticky -top-1 text-lg font-semibold capitalize text-gray-400 bg-white w-full">
                {type} Programme
              </div>
              {selectedValue.length === 0 ? (
                <div className="flex items-center w-full justify-center font-semibold min-h-[30vh]">
                  No data found
                </div>
              ) : (
                selectedValue.map((value) => (
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
                ))
              )}
            </TabsList>

            {selectedValue.length === 0 ? (
              <div className="flex mx-auto">
                <NoData />
              </div>
            ) : (
              selectedValue.map((s) => (
                <TabsContent
                  value={s.id}
                  className="overflow-y-auto max-h-[52vh] sm:max-h-[59vh] custom-scrollbar pb-2"
                  key={s.id}
                >
                  <div className="flex flex-col items-start gap-4 mb-2 px-4 pb-4">
                    {Object.entries(s.categories).map(([key, value]) => (
                      <p
                        key={key}
                        style={{ color: value.color }}
                        className="font-semibold"
                      >
                        {value.name}
                      </p>
                    ))}
                    <div className="flex flex-col sm:flex-row items-start justify-start gap-4 w-full">
                      <img
                        src={s.bg_image ? s.bg_image : dummy}
                        alt={s.title}
                        className="w-full sm:w-[200px] h-[130px] rounded-lg object-cover opacity-80"
                      />
                      <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                          {s.title}
                        </h2>
                        <div className="flex gap-5">
                          <div className="flex items-center gap-1 text-sm text-primary font-semibold mb-1">
                            <Calendar1 size={17} /> {`${s.start_date}`}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-primary font-semibold mb-1">
                            <Clock size={17} />{" "}
                            {`${s.start_time} - ${s.end_time}`}
                          </div>
                        </div>
                        <div className="flex flex-start gap-3">
                          <div className="flex items-center gap-1 text-sm text-primary font-semibold">
                            <MapPin size={17} /> {s.location}
                          </div>
                          {s.venue && (
                            <Button
                              onClick={() =>
                                navigate(
                                  `/venue?id=${s.venue.designId}&venueid=${s.venue.id}`,
                                )
                              }
                              variant={"link"}
                              size={"sm"}
                              className="p-0! ml-4"
                            >
                              Room no: {s.venue.name}
                            </Button>
                          )}
                        </div>
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
              ))
            )}
          </Tabs>
        </div>
      )}
    </Modal>
  );
};

export default EventModal;
