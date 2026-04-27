import Linkedin from "@/assets/Icons/Linkedin";
import { Pencil, Trash2, X } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import Keynote from "@/assets/Icons/Keynote";
import {
  useDeleteSpeaker,
  useGetAdminSpeakerList,
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
import { useDebounce } from "@/hooks/useDebounce";

const CustomTable = () => {
  const [page, setPage] = useState<number>(1);
  const { selected, isDeleting, searchText } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice,
  );
  const { SpeakerList, isPending, error } = useGetAdminSpeakerList(
    page,
    useDebounce(searchText, 300),
  );
  const { DeleteSpeaker, isPending: isDeleteSpeakerPending } =
    useDeleteSpeaker();
  const [openAttachment, setOpenAttachment] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const SpeakersList = useMemo(() => {
    if (!SpeakerList) return [];
    const newData = SpeakerList.response.data;
    if (!newData) return [];
    return newData;
  }, [SpeakerList]);

  const chunkSize = 10;
  const maxPage = SpeakerList?.response.max_page || 1;

  let start = Math.floor((page - 1) / chunkSize) * chunkSize + 1;
  let end = start + chunkSize - 1;

  if (end > maxPage) {
    end = maxPage;
    start = Math.max(1, end - chunkSize + 1);
  }

  useEffect(() => {
    if (SpeakersList.length === 0) return;

    dispatch(setSpeaker(SpeakersList));
  }, [SpeakersList]);

  if (isPending) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <ErrorDisplay title="Speaker Table Error" message={error.message} />
      </div>
    );
  }

  if (!SpeakerList || SpeakersList.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div>
        <div className="overflow-x-auto h-[72.5vh] relative custom-scrollbar mb-4">
          <table
            className="w-full border-separate"
            style={{ borderSpacing: "0 8px" }}
          >
            <thead className="sticky top-0 z-10 h-10 py-5 shadow border border-gray-200 bg-gray-100">
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
                  Email
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
                  <td className="px-3 text-center py-2 rounded-l-xl max-w-[50px]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                    {[item.prefix, item.firstname, item.lastname]
                      .filter(
                        (val) => val && val.toLocaleLowerCase() !== "null",
                      )
                      .join(" ")}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {item.bio}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {item?.email}
                  </td>
                  <td className="px-6 items-center py-2 max-w-[70px]">
                    <Linkedin size={20} />
                  </td>
                  <td className="pl-9 py-2 max-w-[80px]">
                    <img
                      src={item.profile_image ? item.profile_image : Avatar1}
                      className="w-6 h-6"
                    />
                  </td>
                  <td className="pl-9 py-2 max-w-[80px]">
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
                      "NA"
                    )}
                  </td>
                  <td className="pl-10 py-2 w-1/11">
                    {item.keyNote ? (
                      <Keynote size={20} className="text-primary" />
                    ) : (
                      <X size={20} className="text-red-400" />
                    )}
                  </td>
                  <td className="px-6 py-2 rounded-r-xl w-1/11">
                    <div className="flex items-center h-full gap-2">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center bg-white rounded-md border border-gray-400">
            <Button
              size={"sm"}
              className="hover:bg-primary hover:text-white bg-white text-black border-r rounded-r-none"
              disabled={page === 1}
              onClick={() => setPage((pre) => pre - 1)}
              // className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Previous
            </Button>
            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
              (num) => {
                return (
                  <Button
                    key={num}
                    size={"sm"}
                    className={cn(
                      "hover:bg-primary rounded-none hover:text-white bg-white text-black border-r",
                      page === num && "bg-primary text-white",
                    )}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </Button>
                );
              },
            )}
            <Button
              size={"sm"}
              className="hover:bg-primary hover:text-white bg-white text-black rounded-l-none"
              disabled={page === SpeakerList?.response.max_page}
              onClick={() => setPage((pre) => pre + 1)}
              // className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Next
            </Button>
          </div>
        </div>
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
