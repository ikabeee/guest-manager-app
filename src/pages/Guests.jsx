import GuestList from "../components/GuestList";


export default function Guests() {
    return(
        <div>
            <div className="min-w-0 flex-1 mb-4">
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Guest List</h2>
            </div>
            <GuestList/>
        </div>
    )
}