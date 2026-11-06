import { Navigate, useSearchParams } from "react-router";
import AgendaView from "./AgendaView";

/** Mobile: agenda list (program/hybrid-calendar-by-date) instead of the wide grid. */
const ProgrammeMobile = () => {
  const [searchParams] = useSearchParams();
  const programmeId = searchParams.get("programmeid");
  const date = searchParams.get("date");

  // Deep links from the venue pages use ?date=&programmeid=; the agenda reads ?day=&session=
  if (programmeId) {
    const params = new URLSearchParams(searchParams);
    params.delete("programmeid");
    params.delete("date");
    params.set("session", programmeId);
    if (date) params.set("day", date);
    return <Navigate to={{ search: `?${params}` }} replace />;
  }

  return <AgendaView />;
};

export default ProgrammeMobile;
