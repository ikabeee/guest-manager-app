import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Avatar, DropdownTrigger, Button, Dropdown, DropdownMenu, DropdownItem, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Form, Input, Alert } from "@heroui/react";
import { useEffect, useMemo, useState, useRef } from "react";
import UserService from "../services/UserService";
import VerticalDotsIcon from "./VerticalDotsIcon";
import { EditIcon, Trash } from "lucide-react";
import { useDisclosure } from "@heroui/react";
import { useForm } from "react-hook-form";
import AddFriend from "./AddFriend";

const columns = [
    { id: 1, name: "Id" },
    { id: 2, name: "Name" },
    { id: 3, name: "Tel" },
    { id: 4, name: "Sites" },
    { id: 5, name: "Actions" }
];

export default function FriendList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowPerPage = 10;
    const [error, setError] = useState("");
    const [selectedUser, setSelectedUser] = useState(null); 
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { register, handleSubmit, reset } = useForm();
    const formRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const fetchUsers = async () => {
        try {
            const response = await UserService.findAll();

            const formattedUsers = response.data.map(user => ({
                ...user,
                name: user.name
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
            }));
            const guestUsers = formattedUsers.filter(user => user.role === "GUEST");
            setUsers(guestUsers);
        } catch (e) {
            console.error("Error fetching friends", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await UserService.deleteUser(id);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting a friend", error);
        }
    };

    const pages = useMemo(() => {
        return users?.length ? Math.ceil(users.length / rowPerPage) : 0;
    }, [users?.length, rowPerPage]);

    const handleEdit = (user) => {
        setSelectedUser(user); 
        reset({
            name: user.name,
            tel: user.tel,
            sites: user.sites
        });
        onOpen(); 
    };

    const onSubmit = async (data) => {
        try {
            await UserService.update(selectedUser.id, {
                name: data.name,
                tel: data.tel,
                sites: parseInt(data.sites),
            });
            onClose(); 
            fetchUsers(); 
        } catch (error) {
            setError("Error updating user: " + error.message);
        }
    };


    const sortedUsers = useMemo(() => {
        return users.sort((a, b) => a.id - b.id);
    }, [users]);

    return (
        <div className="relative">
            <div className="flex gap-3 justify-end mb-3">
                <AddFriend fetchUsers={fetchUsers}/>
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
                    <TableBody emptyContent="No friends to display">
                        {sortedUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell className="flex items-center gap-x-4">
                                    <Avatar isBordered radius="md" size="sm" src="" />
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.tel}</TableCell>
                                <TableCell>{user.sites}</TableCell>
                                <TableCell className="items-center justify-end">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly size="sm" variant="light">
                                                <VerticalDotsIcon className="text-default-300" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            <DropdownItem color="secondary" startContent={<EditIcon />} key="edit" onPress={() => handleEdit(user)}>
                                                Edit
                                            </DropdownItem>
                                            <DropdownItem color="danger" startContent={<Trash />} key="delete" onPress={() => handleDelete(user.id)}>
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

            {selectedUser && (
                <Modal isOpen={isOpen} size="lg" onClose={onClose}>
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
                        <ModalBody>
                            <Form className="w-full" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
                                <Input
                                    isRequired
                                    label="Name"
                                    labelPlacement="outside"
                                    name="name"
                                    placeholder="Enter user's name"
                                    type="text"
                                    {...register("name")}
                                />
                                <Input
                                    isRequired
                                    label="Telephone"
                                    labelPlacement="outside"
                                    name="tel"
                                    placeholder="Enter user's telephone number"
                                    type="text"
                                    {...register("tel")}
                                />
                                <Input
                                    isRequired
                                    label="Sites"
                                    labelPlacement="outside"
                                    name="sites"
                                    placeholder="Enter the number of sites"
                                    type="number"
                                    {...register("sites")}
                                />
                                {error && <Alert color="warning">{error}</Alert>} 
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="bordered" startContent={<Trash />} onPress={onClose}>
                                Close
                            </Button>
                            <Button color="secondary" type="submit" startContent={<EditIcon />} onPress={handleSubmit(onSubmit)}>
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}
