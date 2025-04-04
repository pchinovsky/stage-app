import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ButtonDynamic({
    text,
    icon,
    onPress,
    style,
    disableExpand = false,
    disabled,
    selectionMode,
    selection,
}) {
    const [hovered, setHovered] = useState(false);

    let tooltipContent;
    if (disableExpand) {
        tooltipContent = !selectionMode
            ? "Activate selection mode."
            : !selection
              ? "Make a selection."
              : disabled
                ? "Selection must consist of events with the same status."
                : text;
    }

    return (
        <motion.div
            initial={false}
            animate={{
                width: hovered && !disableExpand ? 170 : 49,
                height: 49,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
            }}
            className={`bg-white rounded-full shadow-lg overflow-hidden flex items-center justify-center ${
                disabled
                    ? "backdrop-blur-md bg-opacity-[5%] shadow-none text-gray-500"
                    : "text-black"
            }`}
            onHoverStart={() => !disableExpand && setHovered(true)}
            onHoverEnd={() => !disableExpand && setHovered(false)}
        >
            <Tooltip
                isDisabled={!disableExpand}
                content={tooltipContent}
                placement="bottom"
                radius="sm"
            >
                <Button
                    onPress={onPress}
                    isIconOnly={false}
                    isDisabled={disabled}
                    className="w-full h-full flex items-center justify-center px-2 py-2 rounded-full bg-white"
                    // className={`flex items-center bg-white text-black px-2 py-2 rounded-full overflow-hidden shadow-lg z-[1000] ${disabled ? "backdrop-blur-md bg-opacity-[5%] shadow-none text-gray-500" : ""}`}
                >
                    <Icon
                        icon={icon}
                        width={20}
                        className="mx-2"
                        style={style}
                    />
                    {hovered && !disableExpand && (
                        <span className="whitespace-nowrap ml-2">{text}</span>
                    )}
                </Button>
            </Tooltip>
        </motion.div>
    );
}
