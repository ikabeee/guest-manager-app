import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import InviteList from "../components/InviteList";

export default function Invite() {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.clear("userData")
        navigate('/')
    }
    return (
        <>
            <div className="flex flex-col h-screen justify-center items-center">
                <InviteList />
                <div className="flex justify-center w-full p-4">
                    <Button
                        className="flex items-center justify-center font-normal"
                        size="md"
                        radius="sm"
                        color="danger"
                        type="submit"
                        onPress={handleLogOut}
                    >
                        Log Out
                    </Button>
                </div>
            </div>

        </>
    )
}