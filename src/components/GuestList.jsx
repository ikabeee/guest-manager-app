import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Avatar, DropdownTrigger, Button, Dropdown, DropdownMenu, DropdownItem, Pagination } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import GuestService from "../services/GuestService";
import VerticalDotsIcon from "./VerticalDotsIcon";
import { Trash } from "lucide-react";

const columns = [
    { id: 1, name: "Id" },
    { id: 2, name: "Name" },
    { id: 3, name: "Tel" },
    { id: 4, name: "Invited by" },
    { id: 5, name: "Actions" }
];

export default function GuestList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await GuestService.findAll();
            const formattedUsers = response.data.map(user => ({
                ...user,
                name: user.name
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
            }));
            setUsers(formattedUsers);
        } catch (e) {
            console.error("Error fetching friends", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await GuestService.deleteGuest(id);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting a friend", error);
        }
    }

    const pages = useMemo(() => {
        return users?.length ? Math.ceil(users.length / rowPerPage) : 0;
    }, [users?.length, rowPerPage]);

    return (
        <div className="relative">
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Spinner color="secondary" variant="wave">Loading</Spinner>
                </div>
            ) : (

                <Table
                    aria-label="Dynamic table"
                    bottomContent={
                        pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="secondary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null
                    }
                >
                    <TableHeader>
                        {columns.map(column => (
                            <TableColumn className="bg-[#F1F2F7] text-[#A6ABC8]" key={column.id}>{column.name}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody emptyContent="No guests to display">
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell className="flex items-center gap-x-4">
                                    <Avatar isBordered radius="md" size="sm" src="" />
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.tel}</TableCell>
                                <TableCell>{user.user.name}</TableCell>
                                <TableCell className="items-center justify-end">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly size="sm" variant="light">
                                                <VerticalDotsIcon className="text-default-300" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            <DropdownItem color="danger" startContent={<Trash />} key="delete" onPress={()=> handleDelete(user.id)}>Delete</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
