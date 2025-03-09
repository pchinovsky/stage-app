import React from "react";
import { Input } from "@heroui/react";

export default function DurationInput({
    hours = "00",
    minutes = "00",
    onHoursChange,
    onMinutesChange,
    isInvalid,
    errorMessage,
}) {
    const handleHoursChange = (e) => {
        const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 99);
        onHoursChange(String(value).padStart(2, "0"));
    };

    const handleMinutesChange = (e) => {
        const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 59);
        onMinutesChange(String(value).padStart(2, "0"));
    };

    return (
        <div className="flex flex-row items-end gap-2">
            <Input
                type="number"
                label="Hours"
                placeholder="00"
                min={0}
                max={99}
                value={hours}
                onChange={handleHoursChange}
                className="w-[120px]"
                variant="bordered"
                size="lg"
                endContent={<span className="text-default-400">h</span>}
                isInvalid={isInvalid}
                errorMessage={errorMessage}
            />
            <Input
                type="number"
                label="Minutes"
                placeholder="00"
                min={0}
                max={59}
                value={minutes}
                onChange={handleMinutesChange}
                className="w-[120px]"
                variant="bordered"
                size="lg"
                endContent={<span className="text-default-400">m</span>}
                isInvalid={isInvalid}
                errorMessage={errorMessage}
            />
        </div>
    );
}
