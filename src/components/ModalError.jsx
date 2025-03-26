import React from "react";
import {
    Modal,
    Button,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
} from "@heroui/react";
import { useError } from "../contexts/ErrorContext";

const ErrorModal = () => {
    const { error, clearError } = useError();

    console.log("modal error - ", error);

    return (
        <Modal isOpen={!!error} onClose={clearError}>
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
