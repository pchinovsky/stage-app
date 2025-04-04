import { Card, CardFooter, Image, Button } from "@heroui/react";
import ProfileCard from "./ProfileCard";

export default function TooltipProfile({ data, onClick }) {
    if (!data) return null;

    const { name, profileImage, description, type } = data;
    const shortDescription =
        description?.length > 60
            ? description.slice(0, 60) + "..."
            : description || "No description available";

    return (
        <ProfileCard
            data={data}
            size={{ width: "170px", height: "170px" }}
            onClick={onClick}
            styles={{
                text: "text-sm",
                pos: "self-start",
                desc: 45,
                footer: "h-[80px]",
            }}
            footer={true}
        />
    );
}
