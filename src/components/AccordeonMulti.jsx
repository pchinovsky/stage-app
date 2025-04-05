import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function MultiAccordion({ sections }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleSection = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div
            className={`w-[955px] h-[335px] font-primary border border-white shadow-md rounded-lg bg-transparent hover:bg-white transition-all ease-in-out duration-1000 overflow-hidden`}
        >
            {sections.map((section, index) => (
                <div
                    key={index}
                    className="border-b last:border-none border-slate-300"
                >
                    {/* Header */}
                    <button
                        onClick={() => toggleSection(index)}
                        className="w-full flex justify-between items-center p-3 bg-transparent transition overflow-hidden rounded-lg"
                    >
                        <span className="text-lg font-bold text-gray-500 hover:text-gray-900 ml-2">
                            {section.title}
                        </span>
                        <Icon
                            icon={
                                openIndex === index
                                    ? "mdi:chevron-up"
                                    : "mdi:chevron-down"
                            }
                            className="text-xl text-gray-400 transition-transform"
                        />
                    </button>

                    {/*  Expandable */}
                    <motion.div
                        initial={false}
                        animate={{ height: openIndex === index ? "auto" : 0 }}
                        className="overflow-hidden px-3"
                    >
                        {section.title === "Related Content" ? (
                            <div className="py-2 text-blue-400 flex gap-2">
                                {section.content.map((link, i) => (
                                    <Link
                                        key={i}
                                        isExternal
                                        showAnchorIcon
                                        href={link}
                                    >
                                        <div className="py-2 text-blue-400 ml-2">
                                            {link}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-2 text-gray-700 mb-5 ml-2">
                                {section.content}
                            </div>
                        )}
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
