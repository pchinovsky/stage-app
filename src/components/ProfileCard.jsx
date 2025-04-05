import { Card, CardFooter, Image } from "@heroui/react";

export default function ProfileCard({
    data,
    onClick,
    size,
    styles,
    footer = true,
}) {
    return (
        <Card
            isPressable
            onPress={onClick}
            className="relative"
            shadow="md"
            style={{
                width: size.width,
                height: size.height,
                overflow: "hidden",
                flexShrink: 0,
            }}
        >
            <Image
                src={data?.profileImage || data?.image}
                alt={data?.name}
                className="w-[480px] h-full object-cover"
                classNames={{
                    wrapper: "h-full w-[480px]",
                    img: "h-full w-[480px] object-cover",
                }}
                style={{
                    height: "100%",
                }}
            />
            <div
                className={`absolute bottom-0 left-0 right-0 flex justify-center px-2 pb-2 z-10 ${
                    styles.footer ? styles.footer : "h-[100px]"
                }`}
            >
                {footer && (
                    <CardFooter className="bg-white bg-opacity-90 rounded-lg shadow-sm px-3 py-2 w-full">
                        <div
                            className={`flex flex-col justify-end ${styles.pos}`}
                        >
                            <h3
                                className={`m-0 text-left flex items-end font-bold ${styles.text || "text-lg"}`}
                            >
                                {data.name}
                            </h3>
                            <p className="text-tiny text-gray-600 m-0 text-left">
                                {data.description
                                    ? data.description.length > styles.desc
                                        ? data.description.substring(
                                              0,
                                              styles.desc
                                          ) + "..."
                                        : data.description
                                    : "No description"}
                            </p>
                        </div>
                    </CardFooter>
                )}
            </div>
        </Card>
    );
}
