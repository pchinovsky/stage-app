import { useState, useEffect, useRef, useContext } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { Image } from "@heroui/react";
import FloatingControls from "../components/FloatingControls";
import EventCard from "../components/EventCard";
import { NavContext } from "../contexts/navContext";
import FilterBar from "../components/FilterBar";
import styles from "./events.module.css";

export default function EventLayout() {
    const { setNavWhite } = useContext(NavContext);
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const eventSectionTranslate = useTransform(scrollY, [0, 300], [0, -100]);
    const [searchFixed, setSearchFixed] = useState(false);
    const searchBarRef = useRef(null);
    const placeholderRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (searchBarRef.current && placeholderRef.current) {
                const searchRect = searchBarRef.current.getBoundingClientRect();
                const placeholderRect =
                    placeholderRef.current.getBoundingClientRect();

                if (searchRect.top <= 90 && !searchFixed) {
                    setSearchFixed(true);
                    setNavWhite(true);
                } else if (placeholderRect.top >= 0 && searchFixed) {
                    setSearchFixed(false);
                    setNavWhite(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [searchFixed]);

    return (
        <DefaultLayout>
            <div className={styles.layout}>
                {/* Sticky Hero Section */}
                <motion.div className={styles.heroSection}>
                    {/* Side Info Boxes */}
                    <div className={styles.infoBoxes}>
                        <div className={styles.infoBox}>
                            <h3 className={styles.infoTitle}>Real Time Data</h3>
                            <p className={styles.infoText}>
                                Staged events currently
                            </p>
                            <p className={styles.infoNumber}>230,556</p>
                            <p className={styles.infoUpdate}>
                                Last Update: 13:06:33
                            </p>
                        </div>
                        <div className={styles.cityBox}>
                            <h3 className={styles.infoTitle}>
                                Recommended for you
                            </h3>
                            <p className={styles.infoText}>
                                Liste / Showtime September 20
                            </p>
                            <img
                                src="https://sarieva.org/data/i/ST2.jpeg"
                                alt="Building"
                                className={styles.cityImage}
                            />
                        </div>
                    </div>
                    <Image
                        src="https://sarieva.org/data/i/5w.jpeg"
                        alt="Hero Image"
                        className={styles.heroImage}
                        width={1920}
                        height={1080}
                    />
                </motion.div>

                {/* Floating Controls */}
                <div className={styles.floatingControls}>
                    <FloatingControls pos={{ top: "250px", left: "40px" }} />
                </div>

                {/* Placeholder for Filter Bar */}
                <div
                    ref={placeholderRef}
                    className={styles.filterPlaceholder}
                ></div>

                {/* Events Section */}
                <div className={styles.eventsSection}>
                    {/* Filter Bar */}
                    <FilterBar ref={searchBarRef} searchFixed={searchFixed} />

                    {/* Event Cards */}
                    {[...Array(15)].map((_, i) => (
                        <EventCard key={i} />
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
}
