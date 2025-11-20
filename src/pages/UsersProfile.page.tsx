import { useGetUsersProfile } from '@/api/global_api/global_api';
import { Skeleton } from '@/components/ui/skeleton';
import BgIMG from "@/assets/Images/image_2.png";
import { useSearchParams } from 'react-router'
import LOGO from "@/assets/Images/Logo.svg";
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';
import Linkedin from '@/assets/Icons/Linkedin';

const UsersProfile_page = () => {
  const [SearchParams] = useSearchParams()

  const id = SearchParams.get("ID");

  const {UsersProfile, isPending, error} = useGetUsersProfile(id as string)

  if(isPending){
    return <div className='w-full flex justify-center items-center h-[80vh]'><Skeleton className='w-xl h-[60vh]'/></div>
  }

  if(error){
    return <div className='w-full flex justify-center items-center h-[80vh]'>{error.message}</div>
  }

  if(!UsersProfile){
    return null
  }

  return (
    <div className='w-full flex justify-center items-center h-[80vh]'>
      <div
      className={`w-[370px] rounded-lg shadow-lg p-5 text-center relative overflow-hidden border border-gray-100`}
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
        <img src={`data:image/png;base64,${UsersProfile.response.profile_image}`} alt="User" className="w-32 h-32 rounded-full" />
      </div>

      <div>
        <h2 className="font-bold text-xl text-green-800">{`${UsersProfile.response.firstname} ${UsersProfile.response.lastname}`}</h2>
        <p className="text-gray-600 text-sm">{UsersProfile.response.designation}</p>
        <p className="text-gray-500 text-sm mb-5">{UsersProfile.response.company_name}</p>
      </div>
      <div className="border-t border-primary">
        <div className='flex items-center gap-2 my-6 capitalize text-primary'><Mail/><p className='font-semibold'>{UsersProfile.response.email}</p></div>
        <div className='flex items-center gap-2 my-6'><Linkedin size={20}/><p className='text-primary font-semibold'>{UsersProfile.response.linkedin_url}</p></div>
        <div className='flex items-center gap-2 my-6 text-primary'><Phone/><p className="font-semibold">{UsersProfile.response.phone_number}</p></div>
      </div>
    </div>
    </div>
  )
}

export default UsersProfile_page