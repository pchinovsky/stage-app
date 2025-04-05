import {
    Modal,
    Button,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
} from "@heroui/react";
import { useError } from "../contexts/ErrorContext";
import { useNavigate } from "react-router-dom";

const ErrorModal = () => {
    const navigate = useNavigate();
    const { error, clearError } = useError();

    const handleClose = () => {
        clearError();
        navigate(location.pathname, { replace: true });
    };

    console.log("modal error - ", error);

    return (
        <Modal isOpen={!!error} onClose={handleClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Error</ModalHeader>
                        <ModalBody>
                            <p className="text-gray-700">{error}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={clearError}>Close</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ErrorModal;
