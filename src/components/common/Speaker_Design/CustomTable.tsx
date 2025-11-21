import Linkedin from "@/assets/Icons/Linkedin";
import { Pencil, Trash2 } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import Keynote from "@/assets/Icons/Keynote";
import {
  useDeleteSpeaker,
  useGetSpeakerList,
} from "@/api/speaker_design_api/speaker_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setIsDeleting, setSelected } from "@/redux/SpeakerDesignSlice";
import EditModal from "./EditModal";

const CustomTable = () => {
  const {
    SpeakerList,
    isPending: isSpeakerListPending,
    error: errorInSpeakerList,
  } = useGetSpeakerList();
  const { DeleteSpeaker, isPending: isDeleteSpeakerPending } =
    useDeleteSpeaker();
  const { selected, isDeleting } = useSelector(
    (state: RootState) => state.Speaker_DesignSlice
  );
  const dispatch = useDispatch<AppDispatch>();

  if (isSpeakerListPending) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (errorInSpeakerList) {
    return <div>{errorInSpeakerList.message}</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
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
                Keynote
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {SpeakerList?.response.map((item, index) => (
              <tr key={index} className="bg-gray-50 border">
                <td className="px-6 py-2 rounded-[8px]">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
                  {item.name}
                </td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[320px]">
                  {item.bio}
                </td>
                <td className="pl-9 py-2">
                  <Linkedin size={20} />
                </td>
                <td className="pl-9 py-2">
                  <img
                    src={`data:image/png;base64,${item.attachments[0].speaker_image}`}
                    className="w-[24px] h-[24px]"
                  />
                </td>
                <td className="pl-12 py-2">
                  <Keynote size={20} className="text-primary" />
                </td>
                <td className="px-6 py-2 flex gap-2 rounded-[8px]">
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
    </div>
  );
};

export default CustomTable;
