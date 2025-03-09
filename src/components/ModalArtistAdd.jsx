import { useState } from "react";
import {
    Modal,
    Input,
    Textarea,
    Button,
    ModalBody,
    ModalFooter,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import eventsApi from "../api/events-api";

export default function ModalArtistAdd({ isOpen, onClose, onArtistCreated }) {
    const [artistData, setArtistData] = useState({
        name: "",
        description: "",
        image: "",
        website: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArtistData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateArtist = async () => {
        if (!artistData.name.trim()) return;

        const newArtist = {
            ...artistData,
            eventsFeaturedIn: [],
            followedBy: [],
        };

        setLoading(true);
        try {
            const createdArtist = await eventsApi.createArtist(newArtist);

            onArtistCreated(createdArtist);
            onClose();
            setArtistData({
                name: "",
                description: "",
                image: "",
                website: "",
            });
        } catch (error) {
            console.error("Error creating artist:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            placement="center"
            backdrop="opaque"
            size="md"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Create New Artist</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Artist Name"
                                    name="name"
                                    placeholder="Enter artist's name"
                                    value={artistData.name}
                                    onChange={handleChange}
                                    isRequired
                                />
                                <Textarea
                                    label="Description"
                                    name="description"
                                    placeholder="Enter artist description"
                                    value={artistData.description}
                                    onChange={handleChange}
                                    minRows={2}
                                />
                                <Input
                                    label="Image URL"
                                    name="image"
                                    placeholder="Enter artist image URL"
                                    value={artistData.image}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Website"
                                    name="website"
                                    placeholder="Enter artist website"
                                    value={artistData.website}
                                    onChange={handleChange}
                                />{" "}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                onPress={handleCreateArtist}
                                isLoading={loading}
                            >
                                Create Artist
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
