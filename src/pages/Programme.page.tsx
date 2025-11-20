import { useGetProgrammeList } from "@/api/global_api/global_api";
import ProgrammeTitlabar from "@/components/common/Programme/ProgrammeTitleBar";
import TimelineGrid from "@/components/common/Programme/TimelineGrid";
import { setFilterData } from "@/redux/GlobalSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { Check, Search } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Programme_page = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { ProgrammeList, isPending, error } = useGetProgrammeList();
  const { Session } = useSelector((state: RootState) => state.Global_Slice);
  const dispatch = useDispatch<AppDispatch>();

  const allUniqueCategories = Object.values(Session.programme)
    .flat()
    .flatMap((item) => item.categories)
    .reduce((acc: any[], curr) => {
      const exists = acc.some(
        (cat) => cat.name === curr.name && cat.color === curr.color
      );
      if (!exists) acc.push(curr);
      return acc;
    }, []);


  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredProgramme = useCallback(() => {
    const value = Object.fromEntries(
      Object.entries(Session.programme).map(([date, items]) => {
        const filteredItems =
          selectedCategories.length === 0
            ? items
            : items.filter((item) =>
                item.categories.some(
                  (cat) => !selectedCategories.includes(cat.name)
                )
              );

        return [date, filteredItems];
      })
    );
    dispatch(setFilterData(value));
  }, [selectedCategories, Session.programme, dispatch]);

  useEffect(() => {
    filteredProgramme();
  }, [selectedCategories, filteredProgramme]);

  if (isPending || !ProgrammeList) {
    return;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="mx-[7.5%]">
      <ProgrammeTitlabar className="mb-8" />
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <span>Category</span>
          <div className="flex gap-2">
            {allUniqueCategories.map((t) => {
              const isSelected = selectedCategories.includes(t.name);
              // const color =
              return (
                <div
                  key={t.name}
                  onClick={() => toggleCategory(t.name)}
                  // style={{ backgroundColor: t.color }}
                  className={`py-1 px-2 bg-blue-50 rounded-md border border-blue-500 flex gap-1 text-blue-500 cursor-pointer`}
                >
                  {!isSelected && <Check />}
                  <p className="font-semibold">{t.name}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-[250px] h-[30px] rounded-[5px] border border-[#0000001A] bg-[#D9D9D90D] flex items-center gap-2 px-2 py-2">
          <Search />
          <input
            className="w-full text-xs outline-none"
            placeholder="Search for a session"
          />
        </div>
      </div>
      <TimelineGrid />
    </div>
  );
};

export default Programme_page;
