import { Card, CardFooter, Image, Button } from "@heroui/react";

export default function TooltipProfile() {
    return (
        <Card
            isFooterBlurred
            className="border-none py-0 px-0"
            radius="lg"
            style={{ padding: "0px" }}
            isPressable
        >
            <Image
                alt="Woman listing to music"
                className="object-cover"
                height={200}
                src="https://sarieva.org/data/i/2022-ECHO.jpg"
                width={200}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="text-tiny text-white/80">Structura Gallery</p>
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
