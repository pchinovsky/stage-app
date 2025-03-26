import { useState } from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify/react";

export function FormLinks({ links, onChange, error }) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();

            try {
                new URL(inputValue.trim());
                if (!links.includes(inputValue.trim())) {
                    onChange([...links, inputValue.trim()]);
                }
                setInputValue("");
            } catch {
                alert("Invalid URL format. Please enter a valid link.");
            }
        }
    };

    return (
        <div className="w-full">
            <Input
                label="Associated Links"
                name="associatedLinks"
                placeholder="Enter a link and press Enter"
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={handleKeyDown}
                description="Press Enter to add a link"
                startContent={<Icon icon="lucide:link" />}
                isInvalid={!!error?.associatedLinks}
                errorMessage={error?.associatedLinks?.[0]}
            />
        </div>
    );
}
