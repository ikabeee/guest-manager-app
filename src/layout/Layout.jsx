import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import NavbarAdmin from "./NavbarAdmin"

export default function Layout() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex w-screen flex-col">
                <NavbarAdmin/>
                <main className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

