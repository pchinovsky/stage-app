import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const MotionButton = motion(Button);

export default function ButtonDynamicCombined({
    text,
    icon,
    onPress,
    style,
    disableExpand = false,
    disabled,
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className="relative"
            onHoverStart={() => !disableExpand && setHovered(true)}
            onHoverEnd={() => !disableExpand && setHovered(false)}
        >
            <MotionButton
                onPress={onPress}
                isIconOnly
                isDisabled={disabled}
                classNames={{
                    base: [
                        "data-[disabled=true]:bg-red-500",
                        "data-[disabled=true]:opacity-100",
                    ],
                }}
                // initial={{ width: "48px" }}
                animate={{
                    width: hovered && !disableExpand ? "160px" : "49px",
                    height: "49px",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                // className="flex items-center bg-white text-black px-2 py-2 rounded-full overflow-hidden shadow-lg z-[1000]"
                className={`flex items-center bg-white text-black px-2 py-2 rounded-full overflow-hidden shadow-lg z-[1000] ${disabled ? "backdrop-blur-md bg-opacity-[5%] shadow-none" : ""}`}
            >
                <Icon icon={icon} width={24} className="mx-2" style={style} />
                {hovered && !disableExpand && (
                    <span className="whitespace-nowrap ml-2">{text}</span>
                )}
            </MotionButton>
        </motion.div>
    );
}
