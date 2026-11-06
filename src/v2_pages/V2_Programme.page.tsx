import { useIsMobile } from "@/hooks/use-mobile";
import { setTitle } from "@/redux/ModalSlice";
import type { AppDispatch } from "@/redux/store";
import ProgrammeDesktop from "@/v2_components/common/V2_Programme/ProgrammeDesktop";
import ProgrammeMobile from "@/v2_components/common/V2_ProgrammeAgenda/ProgrammeMobile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

/** Programme: agenda list on mobile, calendar grid on desktop. */
const V2_Programme_page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(setTitle(null));
  }, [dispatch]);

  return isMobile ? <ProgrammeMobile /> : <ProgrammeDesktop />;
};

export default V2_Programme_page;
