import {
  CircleUserRound,
  Download,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import DeleteModel from "../../global/DeleteModel";
import UploadModal from "@/components/global/UploadModel";
import EditModal from "./EditModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setIsDeleting,
  setIsPublished,
  setIsUnpublished,
  setNews,
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
import UnPublishModal from "@/components/global/UnPublishModel";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

const CustomTable = () => {
  const [page, setPage] = useState<number>(1);
  const { selected, isDeleting, isPublished, unpublish, searchText } =
    useSelector((state: RootState) => state.Home_Design);

  const { NewsList, isNewsListPending, errorInNewsList } = useGetNewsList(
    page,
    useDebounce(searchText, 300),
  );
  const { DeleteNews, isPending: isDeletePending } = useDeleteNews();
  const { PulishedNew, isPending: isPublishPending } = usePublishedNews();

  const dispatch = useDispatch<AppDispatch>();

  const NewsData = useMemo(() => {
    if (!NewsList) return [];
    return NewsList.response.data ?? [];
  }, [NewsList]);

  const chunkSize = 10;
  const maxPage = NewsList?.response.max_page || 1;

  let start = Math.floor((page - 1) / chunkSize) * chunkSize + 1;
  let end = start + chunkSize - 1;

  if (end > maxPage) {
    end = maxPage;
    start = Math.max(1, end - chunkSize + 1);
  }

  useEffect(() => {
    if (NewsData.length === 0) return;

    dispatch(setNews(NewsData));
  }, [NewsData]);

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
          message={errorInNewsList?.message as string}
        />
      </div>
    );
  }

  if (!NewsList || NewsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div>
        <div className="overflow-x-auto h-[72.5vh] relative custom-scrollbar mb-4">
          <table
            className="min-w-full border-separate"
            style={{ borderSpacing: "0 8px" }}
          >
            <thead className="sticky top-0 z-10 h-10 shadow border border-gray-200">
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
              {NewsData.map((item, index) => (
                <tr key={item.id} className="bg-white border items-center rounded-xl border-black">
                  <td className="px-6 py-2 rounded-l-xl w-1/11">{index + 1}</td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis w-3/11">
                    {item.title}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis w-1/11">
                    {item.description}
                  </td>
                  <td className="px-6 py-2 w-2/11">
                    {new Date(item.created_on).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  {/* <td className="px-6 py-2">{item["Created On"]}</td> */}
                  <td className="px-6 py-2 w-1/11">
                    <div
                      className="bg-cover bg-center w-20 h-7"
                      style={{
                        backgroundImage: item.bg_img
                          ? `url(${item.bg_img})`
                          : "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_7mgjv5xIroykW4GmzzVH4me4sM9rU7WvbQ&s')",
                      }}
                    />
                  </td>
                  <td className="px-6 py-2 w-1/11">
                    <CircleUserRound className="ml-[1.4rem]" />
                  </td>
                  <td className="px-6 py-2 w-1/11">
                    <div className="ml-[1.4rem]">{item.tile_space}</div>
                  </td>
                  <td className="px-6 py-2 rounded-r-xl w-1/11">
                    <div className="flex gap-3 h-full items-center">
                      <Pencil
                        onClick={() => dispatch(setSelected(item.id))}
                        color="#425EBC"
                        size={18}
                        className="cursor-pointer"
                      />
                      {!item.is_published ? (
                        <>
                          <Trash2
                            onClick={() => dispatch(setIsDeleting(item.id))}
                            color="#B85555"
                            size={18}
                            className="cursor-pointer"
                          />
                          <Upload
                            onClick={() => dispatch(setIsPublished(item.id))}
                            size={18}
                            className="cursor-pointer"
                          />
                        </>
                      ) : (
                        <Download
                          size={18}
                          className="cursor-pointer"
                          onClick={() => dispatch(setIsUnpublished(item.id))}
                        />
                      )}
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
              disabled={page === NewsList?.response.max_page}
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
        onConfirm={() => DeleteNews({ id: isDeleting as string })}
        isDeleting={isDeletePending}
      />
      <UploadModal
        isOpen={Boolean(isPublished)}
        onClose={() => dispatch(setIsPublished(null))}
        onConfirm={() =>
          PulishedNew({ id: isPublished as string, is_publish: 1 })
        }
        isAction={isPublishPending}
      />
      <EditModal
        isOpen={Boolean(selected)}
        onClose={() => dispatch(setSelected(null))}
      />
      <UnPublishModal
        isOpen={Boolean(unpublish)}
        onClose={() => dispatch(setIsUnpublished(null))}
        onConfirm={() =>
          PulishedNew({ id: unpublish as string, is_publish: 0 })
        }
        isAction={isPublishPending}
      />
    </div>
  );
};

export default CustomTable;
