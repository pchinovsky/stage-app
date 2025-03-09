import { useState } from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ImageUrlInput({ formValues, handleInputChange, error }) {
    console.log("ImageUrlInput - formValues", formValues);

    const [backgroundImage, setBackgroundImage] = useState(
        formValues.image || ""
    );

    const handleBlur = () => {
        if (formValues.image && isValidImageUrl(formValues.image)) {
            setBackgroundImage(formValues.image);
        }
    };

    return (
        <div>
            <Input
                label="Event Image URL"
                placeholder="Enter image URL"
                name="image"
                value={formValues.image}
                // onChange={(value) => handleInputChange("image", value)}
                onChange={handleInputChange}
                onBlur={handleBlur}
                isInvalid={!!error?.image}
                errorMessage={error?.image?.[0]}
                startContent={<Icon icon="lucide:image" />}
                color="primary"
            />
            {/* {backgroundImage && (
                <div
                    className="goo mt-4 w-full h-64 bg-cover bg-center z-[1000]"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                />
            )} */}
        </div>
    );
}

const isValidImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
};
