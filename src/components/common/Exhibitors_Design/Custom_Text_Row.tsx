import { useEditCategory } from "@/api/programme_design_api/Programme_design_api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  setCategory,
  setDeletingCategory,
  setIsEditable,
} from "@/redux/ExhibitorSlice";
import type { RootState } from "@/redux/store";
import { Check, Loader, Pencil, Trash2, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Custom_Text_RowProp {
  index: string;
  seq: number;
  id: string;
  value: string;
  color: string;
  classname?: string;
  type: number;
}

const Custom_Text_Row: React.FC<Custom_Text_RowProp> = ({
  index,
  seq,
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

  const [tempName, setTempName] = useState(value);
  const [tempColor, setTempColor] = useState(color);
  const [tempSeq, setTempSeq] = useState(seq);

  const { EditCategory, isEditCategoryPending } = useEditCategory();

  useEffect(() => {
    setTempColor(color);
  }, [color]);

  useEffect(() => {
    if (isEditable[id]) {
      setTempName(value);
      setTempColor(color);
      setTempSeq(seq);
      nameRef.current?.focus();
    }
  }, [isEditable[id], value, color, seq, id]);

  const editing = isEditable[id];

  return (
    <div className={cn("flex items-center gap-4 my-2", classname)}>
      {/* SEQUENCE */}
      <input
        type="number"
        className={cn(
          "w-12 h-[30px] rounded-[7px] px-2 text-center outline-none",
          editing ? "bg-[#1111110D] outline-1" : "bg-transparent pointer-events-none",
        )}
        disabled={!editing}
        value={editing ? tempSeq : index}
        min={1}
        onChange={(e) => setTempSeq(Number(e.target.value))}
      />

      {/* NAME */}
      <input
        ref={nameRef}
        className="w-[200px] h-[30px] rounded-[7px] bg-[#1111110D] px-2 outline-none"
        disabled={!editing}
        value={editing ? tempName : value}
        onChange={(e) => setTempName(e.target.value)}
      />

      {/* COLOR PREVIEW */}
      <input
        type="color"
        className="w-[50px] h-[30px] rounded-[7px]"
        disabled={!editing}
        value={editing ? tempColor : color}
        onChange={(e) => setTempColor(e.target.value)}
      />

      {/* COLOR HEX INPUT */}
      <input
        className="w-[100px] h-[30px] rounded-[7px] px-2 outline-none"
        disabled={!editing}
        value={editing ? tempColor : color}
        onChange={(e) => setTempColor(e.target.value)}
      />

      {/* ACTIONS — fixed width to prevent layout shift */}
      <div className="flex items-center gap-3 w-[200px]">
        {!editing ? (
          <>
            <Button
              variant="link"
              size="sm"
              onClick={() =>
                dispatch(setIsEditable({ ...isEditable, [id]: true }))
              }
            >
              <Pencil />
              Edit
            </Button>
            <Button
              className="text-[#B85555] hover:text-[#B85555]"
              variant="link"
              size="sm"
              onClick={() => dispatch(setDeletingCategory(id))}
            >
              <Trash2 />
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              disabled={isEditCategoryPending}
              variant="default"
              size="sm"
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
                  sequence: tempSeq,
                });
              }}
            >
              {isEditCategoryPending ? (
                <>
                  <Loader className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check />
                  Update
                </>
              )}
            </Button>
            <Button
              disabled={isEditCategoryPending}
              variant="ghost"
              size="sm"
              onClick={() =>
                dispatch(setIsEditable({ ...isEditable, [id]: false }))
              }
            >
              <X />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Custom_Text_Row;
