import { useChangeExhibitorSeq } from "@/api/exhibitor_design_api/exhibitor_design_api";
import { useEditCategory } from "@/api/programme_design_api/Programme_design_api";
import { Button } from "@/components/ui/Button";
import {
  setCategory,
  setDeletingCategory,
  setIsEditable,
} from "@/redux/ExhibitorSlice";
import type { RootState } from "@/redux/store";
import { Check, GripVertical, Loader, Pencil, Trash2, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface props {
  Categories: Category[];
  setCategories: (e: Category[]) => void;
}

const CategoryTable = ({ Categories, setCategories }: props) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const { changeExhibitorSeq } = useChangeExhibitorSeq();

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null) return;

    const updated = [...Categories];

    const draggedItem = updated[dragIndex];

    updated.splice(dragIndex, 1);

    updated.splice(dropIndex, 0, draggedItem);

    const finalData = updated.map((item, index) => ({
      ...item,
      seq: index + 1,
    }));

    setCategories(finalData);
    changeExhibitorSeq(finalData.map((pre) => pre.id));

    setDragIndex(null);
  };

  return (
    <div className="overflow-x-auto relative custom-scrollbar">
      <table
        className="min-w-full border-separate"
        style={{ borderSpacing: "0 8px" }}
      >
        <thead className="sticky top-0 z-10 h-10 shadow border border-gray-200 bg-white">
          <tr className="">
            <th className="pl-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              S.no
            </th>
            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category Name
            </th>
            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Color
            </th>
            <th className="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carousel Media
            </th>
            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Categories.map((item, index) => {
            return (
              <CategoryRow
                key={index}
                item={item}
                index={index}
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CategoryRow = memo(
  ({
    item,
    index,
    handleDragStart,
    handleDrop,
  }: {
    item: Category;
    index: number;
    handleDragStart: (e: number) => void;
    handleDrop: (e: number) => void;
  }) => {
    const nameRef = useRef<HTMLInputElement | null>(null);
    const { isEditable, Categorys } = useSelector(
      (state: RootState) => state.ExhibitorSlice,
    );

    const [tempName, setTempName] = useState(item.name);
    const [tempColor, setTempColor] = useState(item.color);
    const [checked, setChecked] = useState<boolean>(Boolean(item.allow_image));
    const dispatch = useDispatch();

    const { EditCategory, isEditCategoryPending } = useEditCategory();

    useEffect(() => {
      setTempColor(item.color);
    }, [item.color]);

    useEffect(() => {
      if (isEditable[item.id]) {
        setTempName(item.name);
        setTempColor(item.color);
        setChecked(Boolean(item.allow_image));
        nameRef.current?.focus();
      }
    }, [isEditable[item.id], item]);

    const editing = isEditable[item.id];

    return (
      <tr
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(index)}
      >
        <td className="pl-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <GripVertical className="cursor-move" />
        </td>
        <td className="px-4 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
          {index + 1}
        </td>
        <td className="px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
          <input
            ref={nameRef}
            className="w-[150px] h-[30px] rounded-[7px] bg-[#1111110D] px-2 outline-none"
            disabled={!editing}
            value={editing ? tempName : item.name}
            onChange={(e) => setTempName(e.target.value)}
          />
        </td>
        <td className="px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center justify-center">
          <input
            type="color"
            className="w-[25px] h-[30px] rounded-[7px]"
            disabled={!editing}
            value={editing ? tempColor : item.color}
            onChange={(e) => setTempColor(e.target.value)}
          />
          <input
            className="w-[100px] h-[30px] rounded-[7px] px-2 outline-none"
            disabled={!editing}
            value={editing ? tempColor : item.color}
            onChange={(e) => setTempColor(e.target.value)}
          />
        </td>
        <td className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <input
            checked={editing ? checked : item.allow_image}
            onChange={(e) => setChecked(e.target.checked)}
            disabled={!editing}
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </td>
        <td className="px-4 rounded-r-xl w-1/11">
          <div className="flex items-center gap-2">
            {!editing ? (
              <>
                <Pencil
                  color="#425EBC"
                  onClick={() =>
                    dispatch(setIsEditable({ ...isEditable, [item.id]: true }))
                  }
                  size={20}
                  className="cursor-pointer"
                />
                <Trash2
                  color="#B85555"
                  onClick={() => dispatch(setDeletingCategory(item.id))}
                  size={20}
                  className="cursor-pointer"
                />
              </>
            ) : (
              <>
                <Button
                  disabled={isEditCategoryPending}
                  variant="default"
                  size="sm"
                  className="h-6 p-1!"
                  onClick={() => {
                    dispatch(
                      setCategory(
                        Categorys.map((pre) =>
                          pre.id === item.id
                            ? {
                                ...pre,
                                name: tempName,
                                color: tempColor,
                                seq: item.seq,
                              }
                            : pre,
                        ),
                      ),
                    );
                    EditCategory({
                      id: item.id,
                      name: tempName,
                      color: tempColor,
                      category_type: item.type,
                      sequence: item.seq as number,
                      allow_image: checked,
                    });
                  }}
                >
                  {isEditCategoryPending ? (
                    <>
                      <Loader className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <Check />
                    </>
                  )}
                </Button>
                <Button
                  disabled={isEditCategoryPending}
                  className="h-6 p-1!"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    dispatch(setIsEditable({ ...isEditable, [item.id]: false }))
                  }
                >
                  <X />
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  },
);

export default CategoryTable;
