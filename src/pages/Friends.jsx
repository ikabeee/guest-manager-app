import FriendList from '../components/FriendList';

export default function Friends() {
    return (
        <div>
            <div className="min-w-0 flex-1">
                <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Friends List</h2>
            </div>
            <FriendList />
        </div>
    )
}