import Speaker from "@/assets/Icons/Speaker"
import { BookText, Boxes, Navigation, Phone, TableProperties, type LucideIcon } from "lucide-react"

type Nav_Routes = {
    Icon: LucideIcon|React.ElementType ,
    title: string,
    route: string
}

export default [
    {
        Icon:BookText,
        title:"News Feed",
        route:"/"
    },
    {
        Icon:TableProperties,
        title: "Programme",
        route: "/programme"
    },
    {
        Icon:Speaker,
        title: "Speakers",
        route: "/speaker"
    },
    {
        Icon:Navigation,
        title: "Venue",
        route: "/venue"
    },
    {
        Icon:Boxes,
        title: "Exhibitors",
        route: "/exhibitors"
    },
    {
        Icon:Phone,
        title: "Contact",
        route: ""
    },
] as Nav_Routes[]