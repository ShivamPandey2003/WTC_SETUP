import { Calendar, House, Inbox, Navigation, Users, type LucideIcon } from "lucide-react"

type Nav_Routes = {
    Icon: LucideIcon|React.ElementType ,
    title: string,
    route: string
}

export default [
    {
        Icon:House,
        title:"home_tab",
        route:"/"
    },
    {
        Icon:Calendar,
        title: "programme_tab",
        route: "/programme"
    },
    {
        Icon:Users,
        title: "speaker_tab",
        route: "/speaker"
    },
    {
        Icon:Navigation,
        title: "venue_tab",
        route: "/venue"
    },
    {
        Icon:Inbox,
        title: "exhibitors_tab",
        route: "/exhibitors"
    },
] as Nav_Routes[]