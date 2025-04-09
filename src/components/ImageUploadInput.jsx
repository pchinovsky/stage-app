import { useState } from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { checkIsDark } from "../../utils/checkIsDark";

export function ImageUploadInput({
    formValues,
    setFormValues,
    previewImage,
    setPreviewImage,
    error,
    uploading,
    setUploading,
}) {
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const localPreviewUrl = URL.createObjectURL(file);
        setPreviewImage(localPreviewUrl);

        setUploading(true);

        try {
            const storage = getStorage();
            const fileName = `events/${Date.now()}_${file.name}`;
            const fileRef = ref(storage, fileName);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);

            const isDark = await checkIsDark(localPreviewUrl);

            setFormValues((prev) => ({
                ...prev,
                image: downloadURL,
                isDark,
            }));
        } catch (err) {
            console.error("Image upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                startContent={<Icon icon="lucide:image" className="mb-0.5" />}
                className="flex-grow h-full"
                label={
                    uploading
                        ? "Uploading..."
                        : !previewImage
                          ? "Upload an image"
                          : "Change image"
                }
                labelPlacement="outside-top"
                isInvalid={!!error?.image}
                errorMessage={error?.image?.[0]}
                isRequired
                classNames={{
                    inputWrapper: "h-full text-gray-500",
                    innerWrapper: "items-end pb-2",
                    input: "pt-0",
                    label: "mb-6 text-tiny",
                    startContent: "text-white",
                }}
            />
        </div>
    );
}
