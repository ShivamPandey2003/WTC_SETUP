import { useEditCategory } from "@/api/programme_design_api/Programme_design_api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { setCategory, setDeletingCategory, setIsEditable } from "@/redux/ExhibitorSlice";
import type { RootState } from "@/redux/store";
import { Check, Loader, Pencil, Trash2, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Custom_Text_RowProp {
  index: string;
  id: string;
  value: string;
  color: string;
  classname?: string;
  type: number;
}

const Custom_Text_Row: React.FC<Custom_Text_RowProp> = ({
  index,
  id,
  value,
  color,
  classname,
  type,
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const { isEditable, Categorys } = useSelector(
    (state: RootState) => state.ExhibitorSlice,
  );

  // ✅ Local temp state
  const [tempName, setTempName] = useState(value);
  const [tempColor, setTempColor] = useState(color);

  const { EditCategory, isEditCategoryPending } = useEditCategory();

  // Sync when edit mode starts
  useEffect(() => {
    if (isEditable[id]) {
      setTempName(value);
      setTempColor(color);
      nameRef.current?.focus();
    }
  }, [isEditable[id], value, color, id]);

  return (
    <div className={cn("flex items-center gap-4 my-2", classname)}>
      <div>{index}.</div>

      {/* NAME INPUT */}
      <input
        ref={nameRef}
        className="w-[200px] h-[30px] rounded-[7px] bg-[#1111110D] px-2 outline-none"
        disabled={!isEditable[id]}
        value={isEditable[id] ? tempName : value}
        onChange={(e) => setTempName(e.target.value)}
      />

      {/* COLOR PREVIEW */}
      <div
        className="w-6 h-6 rounded border border-gray-300"
        style={{ backgroundColor: tempColor }}
      />

      {/* COLOR INPUT */}
      <input
        className={cn("w-[100px] h-[30px] rounded-[7px] px-2", isEditable[id] && "outline-1")}
        disabled={!isEditable[id]}
        value={isEditable[id] ? tempColor : color}
        onChange={(e) => setTempColor(e.target.value)}
      />

      {!isEditable[id] ? (
        <>
          <Button
            variant="link"
            onClick={() =>
              dispatch(
                setIsEditable({
                  ...isEditable,
                  [id]: true,
                }),
              )
            }
          >
            <Pencil />
            Edit
          </Button>

          <Button className="text-[#B85555]" variant="link" onClick={()=>dispatch(setDeletingCategory(id))}>
            <Trash2 />
            Delete
          </Button>
        </>
      ) : (
        <>
          {/* UPDATE */}
          <Button
            disabled={isEditCategoryPending}
            variant="link"
            onClick={() => {
              dispatch(
                setCategory(
                  Categorys.map((pre) =>
                    pre.id === id
                      ? { ...pre, name: tempName, color: tempColor }
                      : pre,
                  ),
                ),
              );

              EditCategory({
                id: id,
                name: tempName,
                color: tempColor,
                category_type: type,
              });
            }}
          >
            {isEditCategoryPending ? (
              <>
                <Loader className="animate-spin" /> processing
              </>
            ) : (
              <>
                <Check />
                Update
              </>
            )}
          </Button>

          {/* CANCEL */}
          <Button
            disabled={isEditCategoryPending}
            variant="link"
            onClick={() =>
              dispatch(
                setIsEditable({
                  ...isEditable,
                  [id]: false,
                }),
              )
            }
          >
            <X />
            Cancel
          </Button>
        </>
      )}
    </div>
  );
};

export default Custom_Text_Row;
