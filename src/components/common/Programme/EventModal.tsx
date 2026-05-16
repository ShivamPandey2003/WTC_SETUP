import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import dummy from "@/assets/Images/Dummy.png";
import type { RootState } from "@/redux/store";
import {
  FileText,
  X,
  CalendarArrowDown,
  BellDot,
  LocateFixed,
  Clock,
  MapPin,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  addToGoogleCalendar,
  addToICalendar,
  addToYahooCalendar,
  cn,
  formatForGoogleCalendar,
  formatDateDisplay,
  addToCalendar,
} from "@/lib/utils";
import { useLocation, useNavigate } from "react-router";
import { useNotifyProgramme } from "@/api/programme_design_api/Programme_design_api";
import Description from "@/components/ui/Description";
import { useIsMobile } from "@/hooks/use-mobile";
import SingleSelect from "@/v2_components/global/SingleSelect";
import NoData from "@/components/global/NoData";
import NewDropdown from "@/v2_components/global/V2_DropDown";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { FaGoogle, FaYahoo } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import SpeakerDetails from "@/v2_pages/SpeakerDetails";

const platform_url = import.meta.env.VITE_REACT_APP_API_URL;

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  data: { id: string; date: string; type?: string };
  ProgrammeData?: Programme[];
};

const Menu = (s: Programme) => [
  {
    id: "Google",
    label: "Google",
    icon: (
      <div className="w-[38px] h-[38px] rounded-[9px] border-[0.5px] flex items-center justify-center bg-[#fff] border-[#DADCE0]">
        <FaGoogle color="#4285F4" />
      </div>
    ),
    onClick: () => {
      addToGoogleCalendar({
        title: s.title,
        start: formatForGoogleCalendar(s.start_date, s.start_time),
        end: formatForGoogleCalendar(s.end_date, s.end_time),
        location: s.location,
      });
    },
  },
  {
    id: "Outlook",
    label: "Outlook",
    icon: (
      <div className="w-[38px] h-[38px] rounded-[9px] border-[0.5px] flex items-center justify-center bg-[#E8F0FC] border-[#E8F0FC]">
        <PiMicrosoftOutlookLogoFill color="#0078D4" />
      </div>
    ),
    onClick: () => {
      addToCalendar({
        title: s.title,
        start: formatForGoogleCalendar(s.start_date, s.start_time),
        end: formatForGoogleCalendar(s.end_date, s.end_time),
        location: s.location,
        description: s.description,
        icsUrl: `${platform_url}/programme/${s.id}/calendar`,
      });
    },
  },
  {
    id: "Yahoo",
    label: "Yahoo",
    icon: (
      <div className="w-[38px] h-[38px] rounded-[9px] border-[0.5px] flex items-center justify-center bg-[#F3E8FA] border-[#F3E8FA]">
        <FaYahoo color="#720E9E" />
      </div>
    ),
    onClick: () => {
      addToYahooCalendar({
        title: s.title,
        start: formatForGoogleCalendar(s.start_date, s.start_time),
        end: formatForGoogleCalendar(s.end_date, s.end_time),
        location: s.location,
      });
    },
  },
  {
    id: "Ical",
    label: "iCal / Event File",
    icon: (
      <div className="w-[38px] h-[38px] rounded-[9px] border-[0.5px] flex items-center justify-center bg-[#FFF0EF] border-[#FFF0EF]">
        <FaFile color="#FF3B30" />
      </div>
    ),
    onClick: () => {
      addToICalendar({
        title: s.title,
        start: formatForGoogleCalendar(s.start_date, s.start_time),
        end: formatForGoogleCalendar(s.end_date, s.end_time),
        location: s.location,
      });
    },
  },
];

const EventModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  ProgrammeData = [],
}) => {
  const { Session, Types } = useSelector(
    (state: RootState) => state.Global_Slice,
  );
  const { appConfig } = useSelector(
    (state: RootState) => state.Global_DesignSlice,
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { notify, isPending } = useNotifyProgramme();
  const isMobile = useIsMobile();
  const [type, setType] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  const selectedValue = React.useMemo(() => {
    const sessionData = ProgrammeData?.length > 0 ? ProgrammeData : Session;

    if (!sessionData?.length) return [];

    const targetDate = data?.date?.trim() ? data.date : date;

    const returnData = sessionData
      .filter((pre) => pre.start_date === targetDate && pre.type === type)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));


    return returnData;
  }, [ProgrammeData, Session, data?.date, type, date]);

  const TypesSortArr = React.useMemo(() => {
    return [...Types].sort((a, b) => {
      if (a === "e-poster") return 1; // move a to end
      if (b === "e-poster") return -1; // keep b at end
      return a.localeCompare(b); // normal sort
    });
  }, [Types]);

  const [value, setValue] = React.useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const ScrollWindow = (id: string) => {
    const el = tabRefs.current[id];
    const container = listRef.current;
    if (!el || !container) return;

    const stickyHeaderHeight = 36;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    container.scrollTop += elTop - containerTop - stickyHeaderHeight;
  };

  React.useEffect(() => {
    const sessionData = ProgrammeData?.length > 0 ? ProgrammeData : Session;
    if (data.id) {
      setValue(data.id);
    }
    const s = sessionData.find((pre) => pre.id === data.id);
    if (data.type) {
      setType(data.type);
    } else {
      if (s?.type) {
        setType(s.type);
      }
    }
    if (!data.date.trim()) {
      setDate(s?.start_date ?? null);
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
    ScrollWindow(data.id);
  }, [data.id, selectedValue]);

  return (
    <>
      {selectedSpeaker && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4 sm:p-4"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:px-6 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Speaker Profile
              </h2>
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="p-2 hover:bg-gray-200 cursor-pointer! rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              <div className="p-4 sm:p-6">
                <SpeakerDetails id={selectedSpeaker} close={null} />
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        showHeader={false}
        isOpen={isOpen}
        onClose={() => {
          const params = new URLSearchParams(location.search);

          params.delete("programmeid");
          params.delete("date");

          navigate(
            {
              pathname: location.pathname,
              search: params.toString(),
            },
            { replace: true },
          );
          onClose(null);
        }}
        size={isMobile ? "lg" : "full"}
        showCloseButton
        classname="overflow-hidden custom-scrollbar p-2 sm:p-4"
      >
        <button
          onClick={() => {
            const params = new URLSearchParams(location.search);

            params.delete("programmeid");
            params.delete("date");

            navigate(
              {
                pathname: location.pathname,
                search: params.toString(),
              },
              { replace: true },
            );
            onClose(null);
          }}
          className="absolute top-3 hover:cursor-pointer hover:bg-gray-200 right-3 p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-700 font-semibold" />
        </button>
        {!selectedValue ? (
          <div>No data found</div>
        ) : (
          <div className="w-full min-h-[400px] sm:min-h-[350px] py-1 px-2">
            <div className="flex flex-row items-end sm:items-center w-full gap-4 mb-3 sm:mb-4">
              <p className="text-xl sm:text-xl font-bold text-primary">
                Day View -{" "}
                {formatDateDisplay(data.date.trim() ? data.date : date)}
              </p>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
                {TypesSortArr.map((item) => (
                  <button
                    key={item}
                    className={cn(
                      "cursor-pointer capitalize text-sm font-medium min-w-fit px-3 py-1 rounded-full transition-colors",
                      type === item
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                    )}
                    onClick={() => {
                      setType(item);
                      setValue("");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
            {isMobile && (
              <div className="mb-3 space-y-2">
                <div>
                  <div className="truncate text-xs font-semibold ml-1 mb-1.5 text-gray-600">
                    Type
                  </div>
                  <SingleSelect
                    onChange={(e) => {
                      setType(e);
                      setValue("");
                    }}
                    selected={type}
                    placeholder="Type"
                    options={TypesSortArr.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                    className="w-full text-xs"
                    capitalize
                  />
                </div>
                <div>
                  <div className="truncate text-xs font-semibold ml-1 mb-1.5 text-gray-600">
                    Session
                  </div>
                  <SingleSelect
                    selected={value}
                    onChange={(e) => setValue(e as string)}
                    options={[...selectedValue]
                      .sort((a, b) => a.start_time.localeCompare(b.start_time))
                      .map((item) => ({
                        label: item.title,
                        value: item.id,
                        start_time: item.start_time,
                        end_time: item.end_time,
                      }))}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            )}
            <Tabs
              defaultValue={data.id}
              value={value || selectedValue[0]?.id}
              onValueChange={setValue}
              className="flex flex-row"
            >
              <TabsList
                ref={listRef}
                className="flex-col hidden sm:flex items-start rounded-none border-r border-gray-300 min-h-[300px] sm:w-[30%] h-full justify-start gap-1.5 pr-2 overflow-y-auto max-h-[52vh] sm:max-h-[59vh]"
              >
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
                        "w-full flex-col items-start px-3 py-2 rounded-lg border transition-colors",
                        "data-[active=false]:bg-gray-50 data-[active=false]:border-transparent data-[active=false]:text-gray-600 hover:bg-gray-100",
                        "data-[active=true]:bg-primary/10 data-[active=true]:border-primary/20 data-[active=true]:text-primary data-[active=true]:shadow-none",
                      )}
                    >
                      <span className="text-xs font-medium opacity-60">{`${value.start_time.slice(0, 5)} – ${value.end_time.slice(0, 5)}`}</span>
                      <div className="text-sm font-semibold line-clamp-2 whitespace-normal text-start mt-0.5">
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
                    <div className="flex flex-col items-start gap-2 sm:gap-4 mb-2 px-2 sm:px-4 pb-4">
                      {Object.entries(s.categories).map(([key, value]) => (
                        <div
                          className="flex items-center gap-3 sm:gap-4 w-full"
                          key={key}
                        >
                          <p
                            style={{
                              color:
                                appConfig?.color_schema?.primary_color ||
                                "#318061",
                            }}
                            className="font-semibold min-w-fit text-xs sm:text-base"
                          >
                            {value.name}
                          </p>
                          <div
                            className="w-full h-2 rounded-full shadow-sm"
                            style={{
                              background:
                                appConfig?.color_schema?.primary_color ||
                                "#318061",
                            }}
                          />
                        </div>
                      ))}
                      <div className="flex flex-col sm:flex-row items-start justify-start gap-2 sm:gap-4 w-full">
                        {s.bg_image && (
                          <img
                            src={s.bg_image}
                            alt={s.title}
                            className="w-full sm:w-[200px] h-[130px] rounded-lg object-cover opacity-80"
                          />
                        )}
                        <div className="flex flex-col gap-1.5 sm:gap-1 flex-1 w-full">
                          <h2 className="text-base sm:text-xl font-bold text-primary mb-1 sm:mb-2 line-clamp-2">
                            {s.title}
                          </h2>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
                            {/* <div className="flex items-center gap-1 text-xs sm:text-sm text-primary font-semibold">
                              <Calendar1 size={14} /> {`${s.start_date}`}
                            </div> */}
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-primary font-semibold">
                              <Clock size={14} />{" "}
                              {`${s.start_time} - ${s.end_time}`}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-3 gap-1">
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-primary font-semibold">
                              <MapPin size={14} /> {s.location}
                            </div>
                            {s.venue && (
                              <div className="flex w-full h-fit sm:w-auto items-center gap-1 text-xs sm:text-sm text-primary font-semibold">
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/venue?id=${s.venue.designId}&venueid=${s.venue.id}&programmeid=${s.id}`,
                                      { replace: true },
                                    )
                                  }
                                  variant={"link"}
                                  size={"sm"}
                                  className="p-0! h-fit! sm:ml-4 underline text-xs sm:text-sm"
                                >
                                  <LocateFixed size={14} className="block" />
                                  <span className="sm:hidden">
                                    Room: {s.venue.name}
                                  </span>
                                  <span className="hidden sm:inline">
                                    {" "}
                                    Room no: {s.venue.name}
                                  </span>
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-row sm:flex-row flex-wrap gap-x-4 w-full">
                            <NewDropdown
                              ListClassName="border-none w-[200px] outline-0 ml-0 mt-0 ring-1 ring-gray-200 font-bold text-xs sm:text-sm"
                              position="bottom-left"
                              trigger={
                                <Button
                                  variant={"link"}
                                  size={"sm"}
                                  className="p-0! underline text-xs sm:text-sm"
                                >
                                  <CalendarArrowDown size={14} /> Add to
                                  calendar
                                </Button>
                              }
                              items={Menu(s)}
                            />
                            {token && (
                              <div className="flex items-center">
                                <Button
                                  variant={"link"}
                                  size={"sm"}
                                  className="p-0! h-fit underline text-xs sm:text-sm"
                                  onClick={() => notify({ id: s.id })}
                                  disabled={isPending}
                                >
                                  <BellDot size={14} /> Notify me
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative px-2 sm:px-4">
                      {s.attachments && s.attachments.length > 0 && (
                        <div className="mb-6">
                          <p className="mb-2 font-semibold text-sm sm:text-base">
                            Paper
                          </p>
                          {
                            // <a href={s.attachments.file} target="_blank">
                            s.attachments
                              .filter((p) => p.has_attachment)
                              .map((e) => (
                                <div
                                  key={e.id}
                                  onClick={() =>
                                    navigate(`/Attachment/${s.id}`, {
                                      state: {
                                        Title: e.filename,
                                        file_id: e.id,
                                      },
                                    })
                                  }
                                  className="flex flex-row items-center gap-2 mb-5 text-xs sm:text-sm text-gray-700"
                                >
                                  <FileText className="w-4 h-4" />
                                  <span className="underline cursor-pointer underline-offset-4">
                                    {e.filename}
                                  </span>
                                </div>
                              ))

                            // </a>
                          }
                        </div>
                      )}
                      {s.speakers && s.speakers.length > 0 && (
                        <div className="mb-6">
                          <p className="font-semibold text-sm sm:text-base">
                            Speakers
                          </p>
                          <div className="flex items-center gap-4 sm:gap-6 mt-4">
                            {s.speakers.map((speaker, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => {
                                  setSelectedSpeaker(speaker.speaker_id);
                                }}
                              >
                                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-900 flex items-center justify-center mb-2 overflow-hidden">
                                  {speaker.profile_img ? (
                                    <img
                                      src={
                                        speaker.profile_img
                                          ? speaker.profile_img
                                          : dummy
                                      }
                                      alt={speaker.fullname}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <svg
                                      className="w-5 sm:w-6 h-5 sm:h-6 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs sm:text-xs text-gray-700 text-center">
                                  {speaker.fullname}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {s.description && s.description.trim() && (
                        <div>
                          <p className="font-semibold text-sm sm:text-base">
                            Description
                          </p>
                          <Description text={s.description} />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))
              )}
            </Tabs>
          </div>
        )}
      </Modal>
    </>
  );
};

export default EventModal;
