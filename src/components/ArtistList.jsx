import { Tooltip, Avatar } from "@heroui/react";
import TooltipProfile from "./TooltipProfile";

export default function ArtistList({
    artists,
    onClick,
    exitDelay,
    isModalOpen,
}) {
    const one = artists.length === 1;
    const h = one ? 120 : 160;

    console.log("isModalOpen", isModalOpen);

    return (
        <div
            className="absolute left-[1000px] top-[120px] w-[450px] max-w-lg overflow-y-auto bg-transparent px-4 py-3 rounded-lg border-2 border-gray-500 z-[100]"
            style={{ height: `${h}px` }}
        >
            <h2 className="text-black text-lg font-bold mb-2">
                {one ? "Artist" : "Artists"}
            </h2>
            <div className="space-y-3">
                {artists.map((artist) => (
                    <Tooltip
                        // key={artist.id}
                        // forcing tooltip re-render to prevent linger post modal closure -
                        // key={isModalOpen ? "closed" : "open"}
                        key={isModalOpen ? `${artist.id}-closed` : artist.id}
                        isOpen={isModalOpen ? false : undefined}
                        content={
                            <TooltipProfile
                                data={artist}
                                onClick={() => onClick(artist)}
                            />
                        }
                        placement="right"
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
                    >
                        <button
                            className="flex items-center gap-3 p-2 bg-gray-900 w-full rounded-lg cursor-pointer"
                            onClick={() => onClick(artist)}
                        >
                            <Avatar src={artist.image} size="sm" />
                            <span className="text-blue-400">{artist.name}</span>
                        </button>
                    </Tooltip>
                ))}
            </div>
        </div>
    );
}
