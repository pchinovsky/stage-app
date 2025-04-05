import { Tooltip, Avatar } from "@heroui/react";
import TooltipProfile from "./TooltipProfile";

export default function ArtistList({
    artists,
    onClick,
    exitDelay,
    isModalOpen,
}) {
    const one = artists.length === 1;
    const h = one ? 120 : 192;

    console.log("isModalOpen", isModalOpen);

    return (
        <div
            className="absolute left-[1100px] top-[120px] w-[350px] max-w-lg overflow-hidden bg-white px-4 py-3 rounded-lg z-[100]"
            style={{
                height: `${h}px`,
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
        >
            <h2 className="text-black text-lg font-bold mb-2">
                {one ? "Artist" : "Artists"}
            </h2>
            <div
                className="artist-scroll space-y-2 overflow-y-auto"
                style={{
                    height: "100%",
                }}
            >
                {artists.map((artist) => (
                    <Tooltip
                        // forcing tooltip re-render to prevent linger post modal closure -
                        key={isModalOpen ? `${artist.id}-closed` : artist.id}
                        isOpen={isModalOpen ? false : undefined}
                        content={
                            <TooltipProfile
                                data={artist}
                                onClick={() => onClick(artist)}
                            />
                        }
                        placement="right"
                        showArrow
                        motionProps={{
                            variants: {
                                exit: {
                                    opacity: 0,
                                    transition: {
                                        duration: 0.2,
                                        ease: "easeIn",
                                    },
                                },
                                enter: {
                                    opacity: 1,
                                    transition: {
                                        duration: 0.7,
                                        ease: "easeOut",
                                    },
                                },
                            },
                        }}
                        closeDelay={exitDelay}
                        className="py-0 px-0"
                        classNames={{
                            base: [
                                "border-0",
                                "before:bg-white dark:before:bg-white before:border-0",
                            ],
                        }}
                    >
                        <button
                            className="flex items-center gap-3 p-2 bg-white w-full rounded-lg cursor-pointer"
                            onClick={() => onClick(artist)}
                        >
                            <Avatar src={artist.profileImage} size="sm" />
                            <span className="text-blue-400">{artist.name}</span>
                        </button>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
