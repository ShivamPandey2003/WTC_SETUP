import SpeakerCard from "@/components/common/Speaker/SpeakerCard"
import Titlabar from "@/components/global/Titlabar"
import Speaker from "@/data/Speaker"

const Speaker_page = () => {
  return (
    <div className="mx-[7.5%]">
        <Titlabar className="mb-8"/>
        <div className="grid xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {
                Speaker.map((prop, index)=>(
                    <SpeakerCard key={index} {...prop}/>
                ))
            }
        </div>
    </div>
  )
}

export default Speaker_page