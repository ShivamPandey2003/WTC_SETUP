import Sidebar from "@/components/global/Sidebar";
import { getPrefix } from "@/lib/utils";
import { Outlet, useLocation } from "react-router";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const active = getPrefix(pathname);

  return (
    <div className="flex h-screen">
      <Sidebar activeItem={active} />
      <Outlet />
    </div>
  );
};

export default AdminLayout;
