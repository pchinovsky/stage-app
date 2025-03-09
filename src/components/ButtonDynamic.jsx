import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const MotionButton = motion(Button);

export default function ButtonDynamicCombined({ text, icon }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className="relative"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <MotionButton
                isIconOnly
                // initial={{ width: "48px" }}
                animate={{ width: hovered ? "160px" : "49px", height: "49px" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center bg-white text-black px-2 py-2 rounded-full overflow-hidden shadow-lg z-[1000]"
            >
                <Icon icon={icon} width={24} className="mx-2" />
                {hovered && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                            type: "tween",
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className="whitespace-nowrap ml-2"
                    >
                        {text}
                    </motion.span>
                )}
            </MotionButton>
        </motion.div>
    );
}
