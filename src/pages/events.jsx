import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { NavContext } from "../contexts/navContext";
import { useError } from "../contexts/errorContext";
import DefaultLayout from "@/layouts/default";
import FilterBar from "../components/FilterBar";
import EventList from "../components/EventList";
import ErrorModal from "../components/ModalError";
import HeroSection from "../components/HeroSection";
import styles from "./events.module.css";

export default function EventLayout() {
    const location = useLocation();

    const searchBarRef = useRef(null);
    const placeholderRef = useRef(null);

    const { setNavWhite } = useContext(NavContext);
    const { error: modalError, showError } = useError();

    const [searchFixed, setSearchFixed] = useState(false);

    const [filters, setFilters] = useState({});

    useEffect(() => {
        if (location.state?.error) {
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
