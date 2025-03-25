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
            size={{ width: "200px", height: "200px" }}
            onClick={onClick}
            footer={true}
        />
        // <Card
        //     isFooterBlurred
        //     className="border-none py-1 px-1 flex items-center justify-center"
        //     radius="lg"
        //     style={{ padding: "5px" }}
        //     isPressable
        //     isHoverable
        //     onPress={onClick}
        // >
        //     <Image
        //         alt={name}
        //         className="object-cover shadow-none"
        //         height={200}
        //         src={profileImage}
        //         width={200}
        //     />
        //     <CardFooter className="justify-between bg-white border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-[10px] w-[calc(100%_-_20px)] shadow-none z-10">
        //         <div className="flex flex-col">
        //             <p className="text-tiny text-black/80 font-bold">{name}</p>
        //             <p className="text-[10px] text-black/60">
        //                 {shortDescription}
        //             </p>
        //         </div>
        //     </CardFooter>
        // </Card>
    );
}
