import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, uploadBytes, ref } from "firebase/storage";
import {
    Modal,
    Input,
    Textarea,
    Button,
    ModalBody,
    ModalFooter,
    ModalContent,
    ModalHeader,
    Image,
    Chip,
} from "@heroui/react";
import { useError } from "../contexts/errorContext";
import { MAX_ADDITIONAL_IMAGES } from "../constants/generalConstants";

export default function ModalArtistAdd({ isOpen, onClose, onArtistCreated }) {
    const { showError } = useError();
    const [artistData, setArtistData] = useState({
        name: "",
        description: "",
        profileImage: "",
        website: "",
    });
    const [loading, setLoading] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
    const [additionalImages, setAdditionalImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArtistData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            const fileUrl = URL.createObjectURL(file);
            setProfilePreviewUrl(fileUrl);

            setArtistData((prev) => ({
                ...prev,
                profileImage: fileUrl,
            }));
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            if (
                additionalImages.length + files.length <=
                MAX_ADDITIONAL_IMAGES
            ) {
                const newImages = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                }));

                setAdditionalImages((prev) => [...prev, ...newImages]);
            }
        }
    };

    const removeAdditionalImage = (indexToRemove) => {
        setAdditionalImages((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleCreateArtist = async () => {
        if (!artistData.name.trim()) return;

        setLoading(true);
        try {
            // 1 - new doc -
            const artistsCollection = collection(db, "artists");
            const docRef = await addDoc(artistsCollection, {
                name: artistData.name,
                description: artistData.description,
                website: artistData.website,
                profileImage: "",
                additionalImages: [],
                eventsFeaturedIn: [],
                followedBy: [],
            });

            // 2 - profile img to storage -
            let profileImageUrl = "";
            if (profileImageFile) {
                const storage = getStorage();
                const fileRef = ref(
                    storage,
                    `artists/${docRef.id}/profile.jpg`
                );
                await uploadBytes(fileRef, profileImageFile);
                profileImageUrl = await getDownloadURL(fileRef);
            }

            // 3 - upload art imgs -
            const additionalImageUrls = [];
            if (additionalImages.length > 0) {
                const storage = getStorage();
                for (let i = 0; i < additionalImages.length; i++) {
                    const file = additionalImages[i].file;
                    const fileRef = ref(
                        storage,
                        `artists/${docRef.id}/additional_${i}.jpg`
                    );
                    await uploadBytes(fileRef, file);
                    const downloadURL = await getDownloadURL(fileRef);
                    additionalImageUrls.push(downloadURL);
                }
            }

            // 4 - update doc with urls -
            await updateDoc(docRef, {
                profileImage: profileImageUrl,
                additionalImages: additionalImageUrls,
            });

            // 5 - create artist obj -
            const createdArtist = {
                id: docRef.id,
                name: artistData.name,
                description: artistData.description,
                website: artistData.website,
                profileImage: profileImageUrl,
                additionalImages: additionalImageUrls,
                eventsFeaturedIn: [],
                followedBy: [],
            };

            // 6 - callback & close modal -
            onArtistCreated(createdArtist);
            onClose();

            // 7 - reset form -
            setArtistData({
                name: "",
                description: "",
                profileImage: "",
                website: "",
            });
            setProfileImageFile(null);
            setProfilePreviewUrl("");
            setAdditionalImages([]);
        } catch (error) {
            console.error("Error creating artist:", error);
            showError(
                error.message || "An error occurred while creating the artist."
            );
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
                                    maxRows={5}
                                />

                                {/* Profile Image upload */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                        Profile Image
                                    </label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                                    />

                                    {/* Profile image preview */}
                                    {profilePreviewUrl && (
                                        <div className="mt-2">
                                            <Image
                                                src={profilePreviewUrl}
                                                alt="Artist profile preview"
                                                className="max-h-20 object-contain rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Art Imgs */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                        Additional Images (
                                        {additionalImages.length}/
                                        {MAX_ADDITIONAL_IMAGES})
                                    </label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleAdditionalImagesChange}
                                        disabled={
                                            additionalImages.length >=
                                            MAX_ADDITIONAL_IMAGES
                                        }
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary-500 file:text-white hover:file:bg-primary-600"
                                    />

                                    {/* Art imgs preview */}
                                    {additionalImages.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {additionalImages.map(
                                                (img, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative w-[73px] h-[73px]"
                                                    >
                                                        <Image
                                                            src={img.preview}
                                                            alt={`Additional image ${index + 1}`}
                                                            width={70}
                                                            height={70}
                                                            className="object-cover rounded-md w-full h-full"
                                                            classNames={{
                                                                wrapper:
                                                                    "w-full h-full",
                                                                img: "w-full h-full",
                                                            }}
                                                        />
                                                        <Chip
                                                            size="sm"
                                                            variant="solid"
                                                            className="absolute top-[1px] right-[5px] cursor-pointer"
                                                            onClose={() =>
                                                                removeAdditionalImage(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            ✕
                                                        </Chip>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Input
                                    label="Website"
                                    name="website"
                                    placeholder="Enter artist website"
                                    value={artistData.website}
                                    onChange={handleChange}
                                />
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
