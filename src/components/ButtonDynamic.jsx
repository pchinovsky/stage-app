import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ButtonDynamic() {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            className="relative"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <motion.div
                // initial={{ width: "48px" }}
                animate={{ width: hovered ? "120px" : "48px" }}
                transition={{ type: "tween", stiffness: 200, damping: 20 }}
                className="absolute left-10 top-10 flex items-center bg-blue-500 text-white px-2 py-2 rounded-full overflow-hidden z-[1000]"
            >
                <Icon icon="mdi:bell-outline" width={24} className="mx-2" />{" "}
                {hovered && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="whitespace-nowrap ml-2"
                    >
                        Follow
                    </motion.span>
                )}
            </motion.div>
        </motion.div>
    );
}
