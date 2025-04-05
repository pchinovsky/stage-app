import { Tooltip, Spinner } from "@heroui/react";
import TooltipProfile from "./TooltipProfile";

export default function EventHead({
    event,
    venue,
    venueLoading,
    isModalOpen,
    handleOpenModal,
}) {
    return (
        <div className="absolute left-[250px] top-[120px] z-[100] flex flex-col items-start gap-2">
            <h1
                className={`font-bold font-primary text-6xl outlined-text ${event.isDark ? "text-gray-300" : "text-gray-900"}`}
            >
                {event.title}
            </h1>
            <h3
                className={`font-bold font-primary text-2xl ${event.isDark ? "text-gray-300" : "text-gray-900"}`}
            >
                {event.subtitle}
            </h3>

            <Tooltip
                content={
                    <TooltipProfile
                        data={venue}
                        onClick={() => handleOpenModal(venue)}
                    />
                }
                key={isModalOpen ? "closed" : "open"}
                isOpen={isModalOpen ? false : undefined}
                placement="bottom"
                offset={10}
                crossOffset={-10}
                delay={0}
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
                className="py-0 px-0"
                radius="lg"
            >
                <button
                    className="font-bold font-primary text-primary text-2xl cursor-pointer"
                    onClick={() => handleOpenModal(venue)}
                >
                    {venueLoading ? <Spinner /> : venue.name}
                </button>
            </Tooltip>
        </div>
    );
}
