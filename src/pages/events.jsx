import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";
import { Image, Tooltip, Spinner, Skeleton } from "@heroui/react";
import FloatingControls from "../components/FloatingControls";
import EventCard from "../components/EventCard";
import { NavContext } from "../contexts/navContext";
import FilterBar from "../components/FilterBar";
import styles from "./events.module.css";
import TabbedCard from "../components/TabCard";
import { useEvents } from "@/hooks/useEvents";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import useRestoreScroll from "../hooks/useRestoreScroll";
import EventList from "../components/EventList";
import ErrorModal from "../components/ModalError";
import { useError } from "../contexts/errorContext";
import { useLocation } from "react-router-dom";
import { getSplitFilters } from "../../utils/getSplitFilters";

export default function EventLayout() {
    const { setNavWhite } = useContext(NavContext);
    const { error: modalError, showError } = useError();
    const location = useLocation();

    const [searchFixed, setSearchFixed] = useState(false);
    const searchBarRef = useRef(null);
    const placeholderRef = useRef(null);

    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (location.state?.error) {
            console.log("error - ", location.state.error);

            if (!modalError) {
                showError(location.state.error);
            }
        }
    }, []);

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
            <ErrorModal />
            <div className={styles.layout}>
                <HeroSection />

                {/* Placeholder for Filter Bar */}
                <div
                    ref={placeholderRef}
                    className={styles.filterPlaceholder}
                ></div>

                {/* Events Section */}
                <div className={styles.eventsSection}>
                    {/* Filter Bar */}
                    <FilterBar
                        ref={searchBarRef}
                        searchFixed={searchFixed}
                        setFilters={setFilters}
                    />

                    <div
                        className={styles.eventsListContainer}
                        style={{ paddingTop: searchFixed ? "112px" : "0px" }}
                    >
                        <EventList filters={filters} />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
