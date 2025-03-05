import { useState } from "react";
import { Modal, Image, Card, Button } from "@heroui/react";

export default function ModalProfile({ profile, isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="p-6 z-[101]">
            <Card className="flex flex-col items-center gap-4 p-6">
                <Image
                    src={profile.image}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full"
                />
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-gray-600">{profile.description}</p>
                <Button onPress={onClose} className="mt-4">
                    Close
                </Button>
            </Card>
        </Modal>
    );
}
