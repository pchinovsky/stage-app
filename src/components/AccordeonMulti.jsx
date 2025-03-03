import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function MultiAccordion({ sections, className }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleSection = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div
            className={`w-[750px] border shadow-md rounded-lg bg-white ${className}`}
        >
            {sections.map((section, index) => (
                <div key={index} className="border-b last:border-none">
                    {/* Header */}
                    <button
                        onClick={() => toggleSection(index)}
                        className="w-full flex justify-between items-center p-3 bg-transparent hover:text-slate-400 transition overflow-hidden rounded-lg"
                    >
                        <span className="text-lg font-medium">
                            {section.title}
                        </span>
                        <Icon
                            icon={
                                openIndex === index
                                    ? "mdi:chevron-up"
                                    : "mdi:chevron-down"
                            }
                            className="text-xl transition-transform"
                        />
                    </button>

                    {/*  Expandable */}
                    <motion.div
                        initial={false}
                        animate={{ height: openIndex === index ? "auto" : 0 }}
                        className="overflow-hidden px-3"
                    >
                        <div className="py-2 text-gray-200">
                            {section.content}
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
