import { Calendar, MapPin } from "lucide-react"; // for icons
// import EXQR from "@/assets/Icons/Primary.svg";
import LOGO from "@/assets/Images/Logo.svg";
import BgIMG from "@/assets/Images/image_2.png";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function WTCBadge() {

   const {qr_image, user_info} = useSelector((state:RootState)=>state.Profile_Slice)

  return (
    <div
      className={`w-[370px] rounded-lg shadow-lg p-5 text-center relative overflow-hidden border border-gray-100 bg-white`}
      style={{ backgroundImage: `url(${BgIMG})` }}
    >
      <div className="flex w-full items-center justify-between mb-5">
        <img src={LOGO} alt="WTC Logo" className="w-16 h-16 object-contain" />

        <div className="text-xs text-gray-700 w-full flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>April 02, 2026 – April 07, 2026</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin size={14} />
            <span>The Convention Center, Montreal, QC</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-3">
        <img src={`data:image/png;base64,${user_info.profile_image}`} alt="User" className="w-32 h-32 rounded-full" />
      </div>

      <div>
        <h2 className="font-bold text-xl text-green-800">{`${user_info.firstname} ${user_info.lastname}`}</h2>
        <p className="text-gray-600 text-sm">{user_info.designation}</p>
        <p className="text-gray-500 text-sm mb-5">{user_info.company_name}</p>
      </div>

      <div className="flex items-center justify-center">
        <img
          src={`data:image/png;base64,${qr_image}`}
          alt="User QR Code"
          width={200}
        />
      </div>
    </div>
  );
}
