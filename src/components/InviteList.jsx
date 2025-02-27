import { 
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
    Spinner, Avatar, DropdownTrigger, Button, Dropdown, DropdownMenu, 
    DropdownItem, Pagination, useDisclosure, Modal, ModalContent, ModalHeader, 
    ModalBody, ModalFooter, Form, Input, Alert 
} from "@heroui/react";
import { useEffect, useMemo, useState, useRef } from "react";
import GuestService from "../services/GuestService";
import { EditIcon, Trash, DoorClosedIcon, UserIcon } from "lucide-react";
import VerticalDotsIcon from "./VerticalDotsIcon";
import AddInvite from "./AddInvite";
import { useForm } from "react-hook-form";

const columns = [
    { id: 1, name: "Id" },
    { id: 2, name: "Name" },
    { id: 3, name: "Tel" },
    { id: 4, name: "Actions" }
];

export default function InviteList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowPerPage = 10;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState("");
    const { register, handleSubmit, reset, setValue } = useForm();
    const formRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userData"));
            const id = parseInt(userInfo.data.id);
            const sites = userInfo.data.sites;  
            const listGuest = await GuestService.getListGuestByUser(id);

            const limitedGuests = listGuest.data.slice(0, sites); 

            const formattedGuest = limitedGuests.map(guest => ({
                ...guest,
                name: guest.name
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
            }))
            .sort((a, b) => a.id - b.id);
            
            setUsers(formattedGuest);
        } catch (e) {
            console.error("Error fetching guests", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await GuestService.deleteGuest(id);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting a guest", error);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setValue("name", user.name);
        setValue("tel", user.tel);
        onOpen();
    };

    const handleUpdate = async (data) => {
        try {
            if (!selectedUser) return;

            await GuestService.update(selectedUser.id, {
                name: data.name,
                tel: data.tel,
            });

            onClose();
            fetchUsers();
            reset();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unexpected error occurred";
            setError(errorMessage);
        }
    };

    const pages = useMemo(() => {
        return users?.length ? Math.ceil(users.length / rowPerPage) : 0;
    }, [users?.length, rowPerPage]);

    return (
        <div className="relative">
            <div className="flex gap-3 justify-end mb-3">
                <AddInvite fetchUsers={fetchUsers} /> 
            </div>

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
                                <TableCell className="items-center justify-end">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly size="sm" variant="light">
                                                <VerticalDotsIcon className="text-default-300" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            <DropdownItem 
                                                color="secondary" 
                                                startContent={<EditIcon />} 
                                                key="edit" 
                                                onPress={() => handleEditClick(user)}
                                            >
                                                Edit
                                            </DropdownItem>
                                            <DropdownItem 
                                                color="danger" 
                                                startContent={<Trash />} 
                                                key="delete" 
                                                onPress={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Modal isOpen={isOpen} size="lg" onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Edit Friend</ModalHeader>
                    <ModalBody>
                        <Form className="w-full" onSubmit={handleSubmit(handleUpdate)} ref={formRef}>
                            <Input
                                isRequired
                                errorMessage="Please enter a valid name"
                                label="Name"
                                labelPlacement="outside"
                                name="name"
                                placeholder="Enter your friend's name"
                                type="text"
                                {...register("name")}
                            />
                            <Input
                                isRequired
                                errorMessage="Please enter a valid Telephone"
                                label="Telephone"
                                labelPlacement="outside"
                                name="tel"
                                placeholder="Enter your friend's telephone number"
                                type="text"
                                {...register("tel")}
                            />
                            {error && <Alert color="warning">{error}</Alert>}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="bordered" startContent={<DoorClosedIcon />} onPress={onClose}>
                            Close
                        </Button>
                        <Button color="secondary" type="submit" startContent={<UserIcon />} onPress={() => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
