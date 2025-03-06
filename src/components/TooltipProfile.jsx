import { Card, CardFooter, Image, Button } from "@heroui/react";

export default function TooltipProfile({ data, onClick }) {
    if (!data) return null;

    const { name, image, description, type } = data;
    const shortDescription =
        description?.length > 60
            ? description.slice(0, 60) + "..."
            : description || "No description available";

    return (
        <Card
            isFooterBlurred
            className="border-none py-1 px-1"
            radius="lg"
            style={{ padding: "5px" }}
            isPressable
            isHoverable
            onPress={onClick}
        >
            <Image
                alt={name}
                className="object-cover shadow-none"
                height={200}
                src={image}
                width={200}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-none ml-1 z-10">
                <div className="flex flex-col">
                    <p className="text-tiny text-white/80 font-bold">{name}</p>
                    <p className="text-[10px] text-white/60">
                        {shortDescription}
                    </p>
                </div>
                <Button
                    className="text-tiny text-white bg-black/20"
                    color="default"
                    radius="lg"
                    size="sm"
                    variant="flat"
                >
                    Explore
                </Button>
            </CardFooter>
        </Card>
    );
}
