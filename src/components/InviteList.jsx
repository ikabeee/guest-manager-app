import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Avatar, DropdownTrigger, Button, Dropdown, DropdownMenu, DropdownItem, Pagination, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Form, Alert } from "@heroui/react";
import { useEffect, useMemo, useState, useRef } from "react";
import GuestService from "../services/GuestService";
import { DoorClosedIcon, EditIcon, PlusIcon, Trash, UserIcon } from "lucide-react";
import VerticalDotsIcon from "./VerticalDotsIcon";
import { useForm } from "react-hook-form";

const columns = [
    { id: 1, name: "Id" },
    { id: 2, name: "Name" },
    { id: 3, name: "Tel" },
    { id: 4, name: "Actions" }
];

export default function InviteList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { register, handleSubmit, reset } = useForm();
    const [page, setPage] = useState(1);
    const formRef = useRef(null);
    const rowPerPage = 10;
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userData"));
            const id = parseInt(userInfo.data.id);
            const listGuest = await GuestService.getListGuestByUser(id);
            const formattedGuest = listGuest.data.map(guest => ({
                ...guest,
                name: guest.name
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
            }));
            setUsers(formattedGuest)
        } catch (e) {
            console.error("Error fetching guests", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
        }
    }
    const onSubmit = async (data) => {
        try {
            const user = localStorage.getItem("userData");
            const userData = JSON.parse(user);
            const userId = parseInt(userData.data.id)
            await GuestService.create({
                name: data.name,
                tel: data.tel,
                userId: userId,
            })
            reset();
            onClose();
            fetchUsers();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unexpected error occurred";
            setError(errorMessage);
        }
    }

    const handleDelete = async (id) => {
        try {
            await GuestService.deleteGuest(id);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting a guest", error);
        }
    }

    const pages = useMemo(() => {
        return users?.length ? Math.ceil(users.length / rowPerPage) : 0;
    }, [users?.length, rowPerPage]);

    return (
        <div className="relative">
            <div className="flex gap-3 justify-end mb-3">
                <Button color="secondary" endContent={<PlusIcon />} onPress={() => { onOpen() }} >
                    Add new
                </Button>
            </div>
            <Modal isOpen={isOpen} size="lg" onClose={onClose}>
                <ModalContent>
                    {(onClose) => {
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Add a new friend</ModalHeader>
                                <ModalBody>
                                    <Form className="w-full" validationBehavior="aria" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
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
                                        {error && (
                                            <Alert color="warning">{error}</Alert>
                                        )}
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="bordered" startContent={<DoorClosedIcon />} onPress={onClose} >
                                        Close
                                    </Button>
                                    <Button color="secondary" type="submit" startContent={<UserIcon />} onPress={handleAddFriend}>
                                        Add a new friend
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }}
                </ModalContent>
            </Modal>
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
                                            <DropdownItem color="secondary" startContent={<EditIcon />} key="edit" onPress={() => { onOpen() }}>Edit</DropdownItem>
                                            <DropdownItem color="danger" startContent={<Trash />} key="delete" onPress={() => handleDelete(user.id)}>Delete</DropdownItem>
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
