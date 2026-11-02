import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import TracksView from "@/v2_components/common/V2_ProgrammeTracks/TracksView";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const V2_ProgrammeTracks_page = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setTitle(null));
  }, [dispatch]);

  return <TracksView />;
};

export default V2_ProgrammeTracks_page;
