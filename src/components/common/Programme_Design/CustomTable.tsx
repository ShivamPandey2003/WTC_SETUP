import { Pencil, Trash2 } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import {
  useDeleteSession,
  useGetCategoryAll,
  useGetSessionList,
} from "@/api/programme_design_api/Programme_design_api";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  setIsDeleting,
  setSelected,
  setSession,
} from "@/redux/ProgrammeDesignSlice";
import EditModal from "./EditModel";
import ErrorDisplay from "@/components/global/ErrorDisplay";
import NoData from "@/components/global/NoData";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

const CustomTable = () => {
  const [page, setPage] = useState<number>(1);
  const { isDeleting, selected, slectedDate } = useSelector(
    (state: RootState) => state.Programme_Design,
  );
  // const {
  //   AllProgramme,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   isFetchingPreviousPage,
  //   hasPreviousPage,
  //   fetchPreviousPage,
  //   status,
  //   error,
  // } = useAdminInfiniteProgramme(slectedDate);
  const {
    SessionList,
    isPending: isListPending,
    error,
  } = useGetSessionList(page, slectedDate);
  const { DeleteSession, isPending: isDeleetSessionPending } =
    useDeleteSession();
  const { AllCategory, isPending } = useGetCategoryAll();
  const dispatch = useDispatch<AppDispatch>();

  const NewValue = useMemo(() => {
    if (!SessionList) return [];
    const newData = SessionList.response.data;
    if (!newData) return [];

    return newData;
  }, [SessionList]);

  const chunkSize = 10;
  const maxPage = SessionList?.response.max_page || 1;

  let start = Math.floor((page - 1) / chunkSize) * chunkSize + 1;
  let end = start + chunkSize - 1;

  if (end > maxPage) {
    end = maxPage;
    start = Math.max(1, end - chunkSize + 1);
  }

  useEffect(()=>{
    setPage(1)
  },[slectedDate])

  useEffect(() => {
    if (NewValue.length === 0) return;
    dispatch(setSession(NewValue));
  }, [NewValue]);

  if (isListPending || isPending) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if (error || status === "error") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ErrorDisplay title="Table Error" message={error?.message as string} />
      </div>
    );
  }

  if (
    !SessionList ||
    NewValue.length === 0 ||
    !NewValue.filter((item) => formatDate(item.start_date) === slectedDate)
      .length
  ) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <NoData />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div>
        <div className="overflow-x-auto h-[70vh] relative custom-scrollbar mb-4">
          <table
            className="min-w-full border-separate"
            style={{ borderSpacing: "0 8px" }}
          >
            <thead className="sticky top-0 z-10 h-10 shadow border border-gray-200 bg-white">
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
                  Starts
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ends
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {NewValue.filter(
                (item) => formatDate(item.start_date) === slectedDate,
              ).map((item, index) => (
                <tr key={item.session_id} className="bg-white border">
                  <td className="px-6 py-2">{index + 1}</td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {item.title}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[320px]">
                    {item.description}
                  </td>
                  <td className="px-6 py-2">{item.start_time}</td>
                  <td className="px-6 py-2">{item.end_time}</td>
                  <td className="px-6 py-2 text-ellipsis truncate max-w-[200px]">
                    {item.category.map((id) => {
                      const Aray: any = new Map(
                        AllCategory?.response.map((i: any) => [i.id, i]),
                      );
                      return Aray.get(id).name;
                    })}
                  </td>
                  <td className="px-6 py-2 flex gap-2">
                    <Pencil
                      onClick={() => dispatch(setSelected(item.session_id))}
                      color="#425EBC"
                      size={18}
                      className="cursor-pointer"
                    />
                    <Trash2
                      onClick={() => dispatch(setIsDeleting(item.session_id))}
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
              disabled={page === SessionList?.response.max_page}
              onClick={() => setPage((pre) => pre + 1)}
              // className={cn(hasPreviousPage && "cursor-pointer")}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <EditModal
        isOpen={Boolean(selected)}
        onClose={() => dispatch(setSelected(null))}
      />
      <DeleteModel
        isOpen={Boolean(isDeleting)}
        onClose={() => dispatch(setIsDeleting(null))}
        onConfirm={() => DeleteSession({ id: isDeleting as string })}
        isDeleting={isDeleetSessionPending}
      />
    </div>
  );
};

export default CustomTable;
