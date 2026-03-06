import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import dummy from "@/assets/Images/Dummy.png";
import type { RootState } from "@/redux/store";
import { FileText, X } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { addToGoogleCalendar, formatForGoogleCalendar } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useNotifyProgramme } from "@/api/programme_design_api/Programme_design_api";

type ModalProps = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<string | null>>;
  id: string | string[];
};

const EventModal: React.FC<ModalProps> = ({ isOpen, onClose, id }) => {
  const { Session } = useSelector((state: RootState) => state.Global_Slice);
  const { notify, isPending } = useNotifyProgramme();

  const selectedValue = Array.isArray(id)
    ? Session.filter((pre) => id.includes(pre.id))
    : Session.find((pre) => pre.id === id);

  const [value, setValue] = React.useState<string>("");

  const navigate = useNavigate();

  React.useEffect(() => {
    if (Array.isArray(id)) {
      setValue(id[0]); // default to the first tab
    } else {
      setValue(id); // single session
    }
  }, [id]);

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={() => onClose(null)}
      size="lg"
      showCloseButton
      classname="overflow-y-auto"
    >
      {!selectedValue ? (
        <div>No such data found</div>
      ) : !Array.isArray(selectedValue) ? (
        <div className="w-full">
          <div className="flex items-start gap-4">
            <img
              src={selectedValue.bg_img ? selectedValue.bg_img : dummy}
              alt={selectedValue.title}
              className="w-[200px] h-[118px] rounded-lg object-cover opacity-80"
            />
            <div className="">
              <h2 className="text-xl font-bold text-primary mb-2">
                {selectedValue.title}
              </h2>
              <p className="text-sm text-primary font-semibold mb-1">
                {`${selectedValue.start_date} - ${selectedValue.end_date}`}
              </p>
              <Button variant={"link"} size={"sm"} className="p-0">
                {selectedValue.location}
              </Button>
              {selectedValue.venue && (
                <Button
                  onClick={() =>
                    navigate(
                      `/venue?id=${selectedValue.venue.designId}&venueid=${selectedValue.venue.id}`,
                    )
                  }
                  variant={"link"}
                  size={"sm"}
                  className="p-0 ml-4"
                >
                  Room no: {selectedValue.venue.design_label} -{" "}
                  {selectedValue.venue.name}
                </Button>
              )}
              <button
                onClick={() => onClose(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-gray-700 font-semibold" />
              </button>
              <div className="flex gap-3 mb-5">
                <Button
                  onClick={() =>
                    addToGoogleCalendar({
                      title: selectedValue.title,
                      start: formatForGoogleCalendar(
                        selectedValue.start_date,
                        selectedValue.start_time,
                      ),
                      end: formatForGoogleCalendar(
                        selectedValue.end_date,
                        selectedValue.end_time,
                      ),
                      location: selectedValue.location,
                    })
                  }
                  variant={"link"}
                  size={"sm"}
                  className="p-0"
                >
                  Add to calendar
                </Button>
                <Button
                  variant={"link"}
                  size={"sm"}
                  className="p-0"
                  onClick={() => notify({ id: selectedValue.id })}
                  disabled={isPending}
                >
                  Notify me
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {selectedValue.description}
            </p>

            {selectedValue.attachments.has_attachment && (
              // <a href={selectedValue.attachments.file} target="_blank">
              <div
                onClick={() => navigate(`/Attachment/${selectedValue.id}`, {state:{Title:selectedValue.attachments.filename}})}
                className="flex items-center gap-2 mb-5 text-sm text-gray-700"
              >
                <FileText className="w-4 h-4" />
                <span className="hover:underline cursor-pointer">
                  {selectedValue.attachments.filename}
                </span>
              </div>
              // </a>
            )}

            <div className="flex items-center gap-6">
              {selectedValue.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => navigate(`/speaker/${speaker.speaker_id}`)}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-2 overflow-hidden">
                    {speaker.profile_img ? (
                      <img
                        src={speaker.profile_img}
                        alt={speaker.fullname}
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
        </div>
      ) : (
        <div className="w-full">
          <Tabs defaultValue={id[0]} value={value} onValueChange={setValue}>
            <TabsList className="mb-4 pl-80 xxs:pl-60 xs:pl-0">
              {selectedValue.map(({ title, id }) => (
                <TabsTrigger
                  key={id}
                  variant={"link"}
                  value={id}
                  className="text-[15px] font-semibold leading-[15px] px-0 mr-6"
                >
                  {title}
                </TabsTrigger>
              ))}
            </TabsList>

            {selectedValue.map((s) => (
              <TabsContent value={s.id} className="h-120" key={s.id}>
                <div className="flex items-start gap-4">
                  <img
                    src={s.bg_img ? `data:image/png;base64,${s.bg_img}` : dummy}
                    alt={s.title}
                    className="w-[200px] h-[118px] rounded-lg object-cover opacity-80"
                  />
                  <div className="">
                    <h2 className="text-xl font-bold text-primary mb-2">
                      {s.title}
                    </h2>
                    <p className="text-sm text-primary font-semibold mb-1">
                      {`${s.start_date} - ${s.end_date}`}
                    </p>
                    <Button variant={"link"} size={"sm"} className="p-0">
                      {s.location}
                    </Button>
                    {s.venue && (
                      <Button
                        onClick={() => navigate(`/venue?id=${s.venue.id}`)}
                        variant={"link"}
                        size={"sm"}
                        className="p-0 ml-4"
                      >
                        Room no: {s.venue.name}
                      </Button>
                    )}
                    <button
                      onClick={() => onClose(null)}
                      className="absolute top-3 right-3 p-1 rounded-full bg-white/90 hover:bg-white transition-colors"
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
                        className="p-0"
                      >
                        Add to calendar
                      </Button>
                      <Button
                        variant={"link"}
                        size={"sm"}
                        className="p-0"
                        onClick={() => notify({ id: s.id })}
                        disabled={isPending}
                      >
                        Notify me
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {s.description}
                  </p>
                  {s.attachments.has_attachment && (
                    // <a href={s.attachments.file} target="_blank">
                    <div
                      onClick={() => navigate(`/Attachment/${s.id}`, {state:{Title:s.attachments.filename}})}
                      className="flex items-center gap-2 mb-5 text-sm text-gray-700"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hover:underline cursor-pointer">
                        {s.attachments.filename}
                      </span>
                    </div>
                    // </a>
                  )}

                  <div className="flex items-center gap-6">
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
