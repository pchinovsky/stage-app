import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Toggle({
    options = ["Option 1", "Option 2"],
    onChange,
}) {
    const selectedRef = useRef(null);

    const [selected, setSelected] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(0);

    useEffect(() => {
        if (selectedRef.current) {
            setSliderWidth(selectedRef.current.offsetWidth);
        }
    }, [selected]);

    const handleToggle = (index) => {
        setSelected(index);
        if (onChange) onChange(options[index]);
    };

    return (
        <div className="absolute left-[1150px] top-[755px] flex items-center w-[300px] h-10 bg-black rounded-full p-1 z-[1000]">
            <motion.div
                className="absolute top-1 left-1 h-8 bg-white rounded-full"
                style={{ width: sliderWidth }}
                animate={{ x: selected === 1 ? "100%" : "0%" }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />

            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleToggle(index)}
                    ref={selected === index ? selectedRef : null}
                    className={`relative w-1/2 h-8 text-center font-medium z-10 ${
                        selected === index ? "text-black" : "text-white"
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
