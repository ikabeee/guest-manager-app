import { Form, Input, Button, Alert } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService"; 
import { useForm } from "react-hook-form";

export default function LoginForm() {
    const [error, setError] = useState(null);
    const {handleSubmit, register} = useForm()
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const { tel } = data;
        try {
            const response = await UserService.findOne(tel);
            localStorage.setItem("userData", JSON.stringify(response));
            if (response.data.role === 'ADMIN') {
                navigate("/admin");
            } else {
                navigate('/invite')
            }
        } catch (e) {
            setError("User not found", e);
        }
    };

    return (
        <div className="border-solid">
            <Form
                className="w-full max-w-xs flex flex-col gap-4 items-center"
                onSubmit={handleSubmit(onSubmit)}
                isBordered
            >
                <Input
                    isRequired
                    errorMessage="Please enter a valid telephone"
                    label="Telephone"
                    labelPlacement="outside"
                    name="tel"
                    placeholder="Enter your telephone"
                    type="text"
                    {...register("tel")}
                />
                <div className="flex gap-2">
                    <Button color="secondary" type="submit">
                        Submit
                    </Button>
                </div>
                {error && (
                    <div>
                        <Alert color="danger" title={error} />
                    </div>
                )}
            </Form>
        </div>
    );
}
