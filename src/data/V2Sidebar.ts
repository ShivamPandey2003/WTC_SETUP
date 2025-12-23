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
        route:"/"
    },
    {
        Icon:Calendar,
        title: "Programme",
        route: "/programme"
    },
    {
        Icon:Users,
        title: "Speakers",
        route: "/speaker"
    },
    {
        Icon:Navigation,
        title: "Venue",
        route: "/venue"
    },
    {
        Icon:Inbox,
        title: "Exhibitors",
        route: "/exhibitors"
    },
] as Nav_Routes[]