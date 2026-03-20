import Linkedin from "@/assets/Icons/Linkedin";
import { Pencil, Trash2, X } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import Keynote from "@/assets/Icons/Keynote";
import {
  useAdminInfiniteSpeakers,
  useDeleteSpeaker,
} from "@/api/speaker_design_api/speaker_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setIsDeleting,
  setSelected,
  setSpeaker,
} from "@/redux/SpeakerDesignSlice";
import EditModal from "./EditModal";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import Avatar1 from "@/assets/Images/Avatar1.png";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import AttachmentModal from "./AttachmentModal";
import { cn } from "@/lib/utils";

const CustomTable = () => {
  const {
    AllSpeakers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    hasPreviousPage,
    fetchPreviousPage,
    status,
    error,
  } = useAdminInfiniteSpeakers();
  const { DeleteSpeaker, isPending: isDeleteSpeakerPending } =
    useDeleteSpeaker();
  const { selected, isDeleting } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const [openAttachment, setOpenAttachment] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const SpeakersList = useMemo(() => {
    if (!AllSpeakers) return [];
    const newData = AllSpeakers.pages.flatMap((page) => page.response.data);
    if (!newData) return [];

    return newData;
  }, [AllSpeakers]);

  useEffect(() => {
    if (SpeakersList.length === 0) return;

    dispatch(setSpeaker(SpeakersList));
  }, [SpeakersList]);

  if (status === "pending" || isFetchingNextPage || isFetchingPreviousPage) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (error || status === "error") {
    return (
      <div className="flex items-center justify-center h-screen">
        <ErrorDisplay
          title="News Feed Error"
          message={error?.message as string}
        />
      </div>
    );
  }

  if (!AllSpeakers || SpeakersList.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div>
        <div className="overflow-x-auto">
          <table
            className="min-w-full border-separate"
            style={{ borderSpacing: "0 8px" }}
          >
            <thead className="">
              <tr>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sno.
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bio
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LinkedIn
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Picture
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attachment
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keynote
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {SpeakersList.map((item, index) => (
                <tr key={index} className="bg-white border">
                  <td className="px-6 py-2">{index + 1}</td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
                    {`${item.prefix} ${item.firstname} ${item.lastname}`}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[320px]">
                    {item.bio}
                  </td>
                  <td className="pl-9 py-2">
                    <Linkedin size={20} />
                  </td>
                  <td className="pl-9 py-2">
                    <img
                      src={item.profile_image ? item.profile_image : Avatar1}
                      className="w-6 h-6"
                    />
                  </td>
                  <td className="pl-9 py-2">
                    {item.attachments.length > 0 ? (
                      <Button
                        variant={"link"}
                        size={"sm"}
                        className="p-0 h-fit"
                        onClick={() => setOpenAttachment(item.speaker_id)}
                      >
                        Check
                      </Button>
                    ) : (
                      "Not Available"
                    )}
                  </td>
                  <td className="pl-10 py-2">
                    {item.keyNote ? (
                      <Keynote size={20} className="text-primary" />
                    ) : (
                      <X size={20} className="text-red-400" />
                    )}
                  </td>
                  <td className="px-6 py-2 flex gap-2">
                    <Pencil
                      onClick={() => dispatch(setSelected(item.speaker_id))}
                      color="#425EBC"
                      size={18}
                      className="cursor-pointer"
                    />
                    <Trash2
                      onClick={() => dispatch(setIsDeleting(item.speaker_id))}
                      color="#B85555"
                      size={18}
                      className="cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasNextPage && (
          <div className="flex items-center gap-4 justify-end w-full">
            <Button
              disabled={!hasPreviousPage}
              onClick={() => fetchPreviousPage()}
              className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Previous
            </Button>
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage}
              className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <DeleteModel
        isOpen={Boolean(isDeleting)}
        onClose={() => dispatch(setIsDeleting(null))}
        onConfirm={() => DeleteSpeaker({ id: isDeleting as string })}
        isDeleting={isDeleteSpeakerPending}
      />
      <EditModal
        isOpen={Boolean(selected)}
        onClose={() => dispatch(setSelected(null))}
      />
      <AttachmentModal
        isOpen={Boolean(openAttachment)}
        onClose={() => setOpenAttachment(null)}
        data={
          SpeakersList.find((pre) => pre.speaker_id === openAttachment)
            ?.attachments ?? []
        }
      />
    </div>
  );
};

export default CustomTable;
