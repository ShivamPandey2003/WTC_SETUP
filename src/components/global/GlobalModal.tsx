import { Plus, Save } from "lucide-react";
import { Button } from "../ui/Button";
import Modal from "../ui/Modal";
import { cn } from "@/lib/utils";
import type React from "react";

type TileSpace = { active: number; value: string[] };

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | TileSpace
  | { [key: string]: JsonValue };

interface GlobalModalProp {
  Title: string;
  Value: Record<string, JsonValue>;
  isOpen: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  onClose: () => void;
  addAttachmentMore?: () => void;
  addSessionsMore?: () => void;
  addSpeakersMore?: () => void;
  roundededImg?: boolean;
}

const GlobalModal: React.FC<GlobalModalProp> = ({
  Title,
  Value,
  isOpen,
  onClose,
  size = "lg",
  addAttachmentMore,
  addSessionsMore,
  addSpeakersMore,
  roundededImg = true,
}) => {
  const isImageUrl = (value: string) =>
    /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(value);

  const ReturnFunction = (type: string) => {
    switch (type) {
      case "Speakers": {
        return addSpeakersMore;
      }
      case "Sessions": {
        return addSessionsMore;
      }
      case "Attachments": {
        return addAttachmentMore;
      }
      default: {
        return () => {};
      }
    }
  };

  return (
    <Modal
      showHeader={false}
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      showCloseButton
      classname="p-0 max-h-screen"
    >
      <div className="bg-primary w-full rounded-t-lg px-8 text-white py-3 text-xl font-[600]">
        {Title}
      </div>
      <div className="p-6">
        <div>
          {Object.keys(Value).map((item, index) => {
            const currentValue = Value[item as keyof typeof Value];

            return (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 mb-4",
                  typeof currentValue === "string" && isImageUrl(currentValue)
                    ? "items-end"
                    : "items-start"
                )}
              >
                <label className="text-sm font-medium text-gray-700 w-32">
                  {item}
                </label>

                {Array.isArray(currentValue) ? (
                  <div className="w-full flex items-center">
                    {currentValue.map((v, i) => (
                      <div
                        key={i}
                        className="mr-2 text-sm underline underline-offset-4"
                      >
                        {String(v)}
                        {i !== currentValue.length && ","}
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        const fn = ReturnFunction(item);
                        if (fn) fn();
                      }}
                      className="flex text-sm items-center cursor-pointer hover:bg-[#31806126] hover:text-primary rounded-md px-2 ml-4"
                    >
                      <Plus size={18} />
                      Add More
                    </div>
                  </div>
                ) : typeof currentValue === "object" &&
                  currentValue !== null &&
                  "value" in currentValue &&
                  Array.isArray((currentValue as TileSpace).value) ? (
                  <div className="w-full flex items-center gap-2">
                    {(currentValue as TileSpace).value.map((item, index) => (
                      <div
                        className={cn(
                          currentValue.active === index
                            ? "text-black font-[500]"
                            : "text-gray-600"
                        )}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                ) : typeof currentValue === "string" &&
                  isImageUrl(currentValue) ? (
                  <div className="w-full flex items-end gap-4">
                    <img
                      src={currentValue}
                      alt={currentValue}
                      className={cn(
                        "w-[100px]",
                        roundededImg && "rounded-full"
                      )}
                    />
                    <h2 className="font-[500] underline underline-offset-4 cursor-pointer text-sm">Change</h2>
                    <h2 className="font-[500] underline underline-offset-4 cursor-pointer text-sm">Remove</h2>
                  </div>
                ) : (
                  <span
                    className={cn(
                      "w-full text-sm break-words break-all",
                      (currentValue as string).includes("https://") &&
                        "underline underline-offset-4"
                    )}
                  >
                    {currentValue as string}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-2 mt-8">
          <Button variant={"ghost"} className="text-black" onClick={onClose}>
            Cancel
          </Button>
          <Button>
            <Save />
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GlobalModal;
