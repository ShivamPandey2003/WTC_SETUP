import { Pencil, Trash2 } from "lucide-react";
import DeleteModel from "@/components/global/DeleteModel";
import { useDeleteSession, useGetSessionList } from "@/api/programme_design_api/Programme_design_api";
import { dateCustom } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setIsDeleting } from "@/redux/ProgrammeDesignSlice";

const CustomTable = () => {
  const {SessionList, isPending:isSessionListPending, error:errorInSessionList} = useGetSessionList()
  const {DeleteSession, isPending:isDeleetSessionPending} = useDeleteSession()
  const {isDeleting} = useSelector((state:RootState)=>state.Programme_Design)
  const dispatch = useDispatch<AppDispatch>()


  if (isSessionListPending) {
    return [1, 2, 3, 4].map((val) => (
      <div key={val} className="w-full">
        <Skeleton className="h-8 w-full mb-2" />
      </div>
    ));
  }

  if(errorInSessionList){
    return <div>{errorInSessionList.message}</div>
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
            {SessionList?.response.map((item, index) => (
              <tr key={item.session_id} className="bg-gray-50 border">
                <td className="px-6 py-2 rounded-[8px]">{index + 1}</td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[130px]">
                  {item.title}
                </td>
                <td className="px-6 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[320px]">
                  {item.description}
                </td>
                <td className="px-6 py-2">{dateCustom(item.start_time)}</td>
                <td className="px-6 py-2">{dateCustom(item.end_time)}</td>
                <td className="px-6 py-2">{item.category}</td>
                <td className="px-6 py-2 flex gap-2 rounded-[8px]">
                  <Pencil
                    color="#425EBC"
                    size={18}
                    className="cursor-pointer"
                  />
                  <Trash2
                  onClick={()=>dispatch(setIsDeleting(item.session_id))}
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
        onClose={()=>dispatch(setIsDeleting(null))}
        onConfirm={() => DeleteSession({id:isDeleting as string})}
        isDeleting={isDeleetSessionPending}
      />
    </div>
  );
};

export default CustomTable;
