import { Button, Modal, ModalContent, ModalHeader, Form, Input, useDisclosure, ModalBody, ModalFooter, Alert } from "@heroui/react";
import { useRef, useState } from "react";
import UserService from "../services/UserService"; // Asegúrate de que UserService esté importado
import { DoorClosedIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";

// eslint-disable-next-line react/prop-types
export default function AddFriend({ fetchUsers }) { 
    const [error, setError] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { register, handleSubmit, reset } = useForm();
    const formRef = useRef(null);

    const handleAddFriend = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
    };

    const onSubmit = async (data) => {
        try {
            await UserService.create({
                name: data.name,
                tel: data.tel,
                sites: parseInt(data.sites),
                role: "GUEST",
            });

            reset();
            onClose();
            fetchUsers();  
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unexpected error occurred";
            setError(errorMessage);
        }
    };

    return (
        <>
            <Button color="secondary" onPress={onOpen}>
                Add new friend
            </Button>
            <Modal isOpen={isOpen} size="lg" onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Add a new friend</ModalHeader>
                    <ModalBody>
                        <Form className="w-full" onSubmit={handleSubmit(onSubmit)} ref={formRef}>
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
                            <Input
                                isRequired
                                errorMessage="Please enter a valid number of sites"
                                label="Sites"
                                labelPlacement="outside"
                                name="sites"
                                placeholder="Enter the number of sites"
                                type="number"
                                {...register("sites")}
                            />
                            {error && <Alert color="warning">{error}</Alert>} {/* Muestra un mensaje de error si ocurre algún problema */}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="bordered" startContent={<DoorClosedIcon />} onPress={onClose}>
                            Close
                        </Button>
                        <Button color="secondary" type="submit" startContent={<UserIcon />} onPress={handleAddFriend}>
                            Add a new friend
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
