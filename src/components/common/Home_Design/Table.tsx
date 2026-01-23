import { CircleUserRound, Pencil, Trash2, Upload } from "lucide-react";
import DeleteModel from "../../global/DeleteModel";
import UploadModal from "@/components/global/UploadModel";
import EditModal from "./EditModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setIsDeleting,
  setIsPublished,
  setSelected,
} from "@/redux/HomeDesignSlice";
import {
  useDeleteNews,
  useGetNewsList,
  usePublishedNews,
} from "@/api/home_design_api/Home_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";

const CustomTable = () => {
  const { NewsList, isNewsListPending, errorInNewsList } = useGetNewsList();
  const { DeleteNews, isPending: isDeletePending } = useDeleteNews();
  const { PulishedNew, isPending: isPublishPending } = usePublishedNews();

  const { selected, isDeleting, isPublished } = useSelector(
    (state: RootState) => state.Home_Design,
  );
  const dispatch = useDispatch<AppDispatch>();

  if (isNewsListPending) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (errorInNewsList) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay
          title="Programme Error"
          message={errorInNewsList.message}
        />
      </div>
    );
  }

  if (!NewsList || !NewsList.response) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
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
                Title
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created On
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Background
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tile Space
              </th>
              <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {NewsList.response.map((item, index) => (
              <tr key={item.id} className="bg-white border">
                <td className="px-6 py-2">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
                  {item.title}
                </td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[350px]">
                  {item.description}
                </td>
                <td className="px-6 py-2">{"Oct 12, 2025"}</td>
                {/* <td className="px-6 py-2">{item["Created On"]}</td> */}
                <td className="px-6 py-2">
                  <div
                    className="bg-cover bg-center w-20 h-7"
                    style={{
                      backgroundImage: item.bg_img
                        ? `url(data:image/png;base64,${item.bg_img})`
                        : "url('https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200')",
                    }}
                  />
                </td>
                <td className="px-6 py-2">
                  <CircleUserRound className="ml-[1.4rem]" />
                </td>
                <td className="px-6 py-2">
                  <div className="ml-[1.4rem]">{item.tile_space}</div>
                </td>
                <td className="px-6 py-2 flex gap-3">
                  <Pencil
                    onClick={() => dispatch(setSelected(item.id))}
                    color="#425EBC"
                    size={18}
                    className="cursor-pointer"
                  />
                  <Trash2
                    onClick={() => dispatch(setIsDeleting(item.id))}
                    color="#B85555"
                    size={18}
                    className="cursor-pointer"
                  />
                  {!item.is_published && (
                    <Upload
                      onClick={() => dispatch(setIsPublished(item.id))}
                      size={18}
                      className="cursor-pointer"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteModel
        isOpen={Boolean(isDeleting)}
        onClose={() => dispatch(setIsDeleting(null))}
        onConfirm={() => DeleteNews({ id: isDeleting as string })}
        isDeleting={isDeletePending}
      />
      <UploadModal
        isOpen={Boolean(isPublished)}
        onClose={() => dispatch(setIsPublished(null))}
        onConfirm={() => PulishedNew({ id: isPublished as string })}
        isAction={isPublishPending}
      />
      <EditModal
        isOpen={Boolean(selected)}
        onClose={() => dispatch(setSelected(null))}
      />
    </div>
  );
};

export default CustomTable;
