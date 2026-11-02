import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import ScheduleView from "@/v2_components/common/V2_ProgrammeSchedule/ScheduleView";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const V2_ProgrammeSchedule_page = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setTitle(null));
  }, [dispatch]);

  return <ScheduleView />;
};

export default V2_ProgrammeSchedule_page;
