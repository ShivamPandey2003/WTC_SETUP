import FLOOR_MAP from '@/assets/Images/FloorMap.png'
import Titlabar from '@/components/global/Titlabar'

const Floor_plan = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
        <img src={FLOOR_MAP} alt="Floor_Map" className='md:w-[500px] h-[500px] mb-4' />
        <Titlabar/>
    </div>
  )
}

export default Floor_plan