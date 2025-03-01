import React, { useState, useRef, forwardRef } from "react";
import {
    Input,
    Select,
    SelectItem,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@heroui/react";
import styles from "./FilterBar.module.css";

const FilterBar = forwardRef(({ searchFixed }, ref) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSearchType, setSelectedSearchType] = useState("events");
    const [activeFilters, setActiveFilters] = useState([
        {
            id: 1,
            label: "Music",
            options: ["Live", "Classical", "Electronic"],
        },
        {
            id: 2,
            label: "Recommended",
            options: ["Trending", "AI Picks"],
        },
        {
            id: 3,
            label: "Invitations",
            options: ["Sent", "Received"],
        },
    ]);
    const [availableFilters, setAvailableFilters] = useState([
        "Music",
        "Recommended",
        "Invitations",
        "Popular",
        "Art",
        "Workshops",
        "Exhibitions",
    ]);

    const filtersRef = useRef(null);

    const removeFilter = (id) => {
        setActiveFilters(activeFilters.filter((filter) => filter.id !== id));
    };

    const toggleFilter = (filter) => {
        if (activeFilters.some((f) => f.label === filter)) {
            setActiveFilters(activeFilters.filter((f) => f.label !== filter));
        } else {
            setActiveFilters([
                ...activeFilters,
                {
                    id: Date.now(),
                    label: filter,
                    options: [],
                },
            ]);
        }
    };

    const scrollLeft = () => {
        if (filtersRef.current) {
            filtersRef.current.scrollBy({
                left: -150,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (filtersRef.current) {
            filtersRef.current.scrollBy({
                left: 150,
                behavior: "smooth",
            });
        }
    };

    return (
        <div
            ref={ref}
            className={`${styles.filterBar} ${searchFixed ? "fixed top-[70px] left-0 z-[1500]" : "relative z-[500]"}`}
        >
            {/* Search */}
            <Input
                placeholder="Search events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.input}
            />

            {/* Search dropdown */}
            <Select
                value={selectedSearchType}
                onChange={setSelectedSearchType}
                className={styles.select}
            >
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="users">Hosts</SelectItem>
                <SelectItem value="locations">Locations</SelectItem>
            </Select>

            {/* Filter section */}
            <div className={styles.filterContainer}>
                {/* Left arrow */}
                <button onClick={scrollLeft} className={styles.arrowButton}>
                    ◀
                </button>

                {/* Filter boxes */}
                <div ref={filtersRef} className={styles.filters}>
                    {activeFilters.map((filter) => (
                        <div key={filter.id} className={styles.filterBox}>
                            <span className={styles.filterLabel}>
                                {filter.label}
                            </span>
                            {filter.options.map((option, index) => (
                                <Chip key={index} size="sm">
                                    {option}
                                </Chip>
                            ))}
                            <button
                                onClick={() => removeFilter(filter.id)}
                                className={styles.removeButton}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* Right arrow */}
                <button onClick={scrollRight} className={styles.arrowButton}>
                    ▶
                </button>
            </div>

            {/* Dropdown Filters */}
            <Dropdown>
                <DropdownTrigger>
                    <Button variant="outline">Filters</Button>
                </DropdownTrigger>
                <DropdownMenu>
                    {availableFilters.map((filter) => (
                        <DropdownItem
                            key={filter}
                            onPress={() => toggleFilter(filter)}
                        >
                            {activeFilters.some((f) => f.label === filter)
                                ? "✅"
                                : "➕"}{" "}
                            {filter}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
});

FilterBar.displayName = "FilterBar";
export default FilterBar;
