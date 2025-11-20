import { cn } from '@/lib/utils'
import { CalendarDays, Navigation, Search } from 'lucide-react'

const ExhibitorsTitlebar = () => {
  return (
    <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between'>
        <h2 className='text-[20px] font-semibold leading-5'>Exhibitors & Sponsors</h2>
        <div className='w-[250px] h-[30px] rounded-[5px] border border-[#0000001A] bg-[#D9D9D90D] flex items-center gap-2 px-2 py-2'>
            <Search/>
            <input
            className='w-full text-xs outline-none'
            placeholder='Search for an exhibitor or sponsor'
            />
        </div>
        <div className={cn("flex flex-col gap-2")}>
      <div className="flex items-center gap-2">
        <CalendarDays size={18} />
        <h3 className="font-medium">April 02, 2026 - April 07, 2026</h3>
      </div>
      <div className="flex items-center gap-2">
        <Navigation size={18} color="black" fill="black"/>
        <h3 className="font-medium">The Convention Center, Montreal, QC</h3>
      </div>
    </div>
    </div>
  )
}

export default ExhibitorsTitlebar