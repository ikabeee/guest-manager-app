import { Button } from "@heroui/react";
import { UsersRound, PartyPopper, Handshake, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const menuItems = [
        [{
            id: 1,
            icon: <Handshake className="text-inherit" />,
            label: "Friends List",
            to: "/"
        },
        {
            id: 2, icon: <UsersRound className="text-inherit" />,
            label: "Guest List",
            to: "guests",

        },
        {
            id: 4,
            icon: <Settings className="text-inherit" />,
            label: "Settings",
            to:"/"
        },
        {
            id: 3,
            icon: <LogOut className="text-inherit" />,
            label: "Log out",
            to: "/"
        }
        ]
    ]


    return (
        <aside className="relative w-60 h-screen bg-[#F1F2F7] p-4 flex flex-col">
            <div className="space-y-6">
                <nav className="absolute bottom-4 left-4 flex flex-col gap-4">
                    {menuItems[0].slice(2, 4 + 1).map((item) => (
                        <Link key={item.id} to={`${item.to}`}>
                            <Button
                                key={item.id}
                                className="flex items-center justify-start gap-x-4 pl-4 w-[200px] h-[42px] font-medium"
                                size="m"
                                radius="sm"
                                variant="light"
                                color="secondary"
                                type="submit"
                            >
                                {item.icon}
                                {item.label}
                            </Button>
                        </Link>
                    ))}

                </nav>
            </div>

            <div className="flex items-center gap-2 mb-8 mt-4">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-[37px] h-[37px] rounded-full bg-secondary flex items-center justify-center">
                        <PartyPopper color="white" />
                    </div>
                    <span className="text-secondary text-l font-semibold">Party Manager</span>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-[#082431] opacity-50 mb-[12px]">MENU</h3>
                    <nav className="space-y-2">
                        {menuItems[0].slice(0, 2).map((item) => (
                            <Link key={item.id} to={`/admin/${item.to}`}>
                                <Button
                                    key={item.id}
                                    className="flex items-center justify-start gap-x-4 pl-4 w-[200px] h-[42px] font-medium"
                                    size="m"
                                    radius="sm"
                                    variant="light"
                                    color="secondary"
                                    type="submit"
                                >
                                    {item.icon}
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </aside >

    );
}
