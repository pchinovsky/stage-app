import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

const MotionButton = motion(Button);

export default function ButtonDynamicClick({ top, left, text, icon }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className="relative"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            style={{ top, left }}
        >
            <MotionButton
                initial={{ width: "28px" }}
                animate={{ width: hovered ? "140px" : "28px" }}
                transition={{ type: "tween", stiffness: 200, damping: 20 }}
                className="absolute flex items-center bg-black text-white px-2 py-2 rounded-full overflow-hidden z-[1000]"
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
