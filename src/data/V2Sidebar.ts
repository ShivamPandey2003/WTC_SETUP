import { Calendar, House, Inbox, Navigation, Users, type LucideIcon } from "lucide-react"

type Nav_Routes = {
    Icon: LucideIcon|React.ElementType ,
    title: string,
    route: string
}

export default [
    {
        Icon:House,
        title:"News Feed",
        route:"/home_v2"
    },
    {
        Icon:Calendar,
        title: "Programme",
        route: "/programme_v2"
    },
    {
        Icon:Users,
        title: "Speakers",
        route: "/speakers_v2"
    },
    {
        Icon:Navigation,
        title: "Venue",
        route: "/venue_v2"
    },
    {
        Icon:Inbox,
        title: "Exhibitors",
        route: "/exhibitors_v2"
    },
] as Nav_Routes[]