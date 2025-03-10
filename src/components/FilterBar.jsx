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
import { Icon } from "@iconify/react";
import { formatISO } from "date-fns";
import { useFollowing } from "../contexts/followingContext";
import styles from "./FilterBar.module.css";

const FilterBar = forwardRef(({ searchFixed, setFilters }, ref) => {
    const { followingUsers, following } = useFollowing();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSearchType, setSelectedSearchType] = useState("events");
    const [selectedChips, setSelectedChips] = useState([]);

    const [activeFilters, setActiveFilters] = useState([
        {
            id: 1,
            label: "Categories",
            options: [
                "Artist Talk",
                "Workshop",
                "Conference",
                "Sound",
                "Presentation",
                "Exhibition",
                "Other",
            ],
        },
        { id: 2, label: "Recommended", options: ["Trending", "AI Picks"] },
        { id: 3, label: "Invitations", options: ["Sent", "Received"] },
        {
            id: 4,
            label: "Time",
            options: ["Today", "Tomorrow", "Upcoming", "Past"],
        },
        {
            id: 5,
            label: "Popular",
            options: ["Today", "Tomorrow", "Upcoming", "Past"],
        },
        {
            id: 6,
            label: "Involved",
            options: ["Following", "Invited", "Inviting"],
        },
    ]);

    const [availableFilters] = useState([
        "Categories",
        "Recommended",
        "Invitations",
        "Time",
        "Popular",
        "Involved",
        "Exhibitions",
    ]);

    const filtersRef = useRef(null);

    const removeFilter = (id) => {
        setActiveFilters((prevFilters) =>
            prevFilters.filter((filter) => filter.id !== id)
        );
    };

    const toggleFilter = (filterLabel) => {
        if (activeFilters.some((f) => f.label === filterLabel)) {
            setActiveFilters(
                activeFilters.filter((f) => f.label !== filterLabel)
            );
        } else {
            setActiveFilters([
                ...activeFilters,
                { id: Date.now(), label: filterLabel, options: [] },
            ]);
        }
    };

    const scrollLeft = () => {
        if (filtersRef.current) {
            filtersRef.current.scrollBy({ left: -150, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (filtersRef.current) {
            filtersRef.current.scrollBy({ left: 150, behavior: "smooth" });
        }
    };

    // --- last -
    const handleChipClick = (category, option) => {
        const scrollY = window.scrollY;

        const filterKey = category.toLowerCase();

        const dynamicValue = getNormalizedFilterValue(filterKey, option);

        setSelectedChips((prevSelected) => {
            let updatedChips;

            if (prevSelected.includes(dynamicValue)) {
                updatedChips = prevSelected.filter(
                    (chip) => chip !== dynamicValue
                );
            } else {
                updatedChips = [...prevSelected, dynamicValue];
            }

            return updatedChips;
        });

        if (dynamicValue === "following") {
            if (selectedChips.includes(dynamicValue)) {
                setFilters({});
            } else {
                console.log(
                    "Using stored following data:",
                    followingUsers,
                    following
                );
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    eventOwners: followingUsers,
                    venueId: following,
                    artists: following,
                    attendees: followingUsers,
                }));
            }
        } else {
            setFilters((prevFilters) => {
                const updatedFilters = { ...prevFilters };

                if (!updatedFilters[filterKey]) {
                    updatedFilters[filterKey] = [];
                }

                if (updatedFilters[filterKey].includes(dynamicValue)) {
                    updatedFilters[filterKey] = updatedFilters[
                        filterKey
                    ].filter((item) => item !== dynamicValue);
                    if (updatedFilters[filterKey].length === 0) {
                        delete updatedFilters[filterKey];
                    }
                } else {
                    updatedFilters[filterKey] = [
                        ...updatedFilters[filterKey],
                        dynamicValue,
                    ];
                }

                if (
                    Object.keys(updatedFilters).every(
                        (key) => updatedFilters[key].length === 0
                    )
                ) {
                    return {};
                }

                return updatedFilters;
            });
        }
    };

    // --- with following -
    // const handleChipClick = (category, option) => {
    //     const filterKey = category.toLowerCase();
    //     const dynamicValue = getNormalizedFilterValue(filterKey, option);

    //     setSelectedChips((prevSelected) => {
    //         let updatedChips;

    //         if (prevSelected.includes(dynamicValue)) {
    //             updatedChips = prevSelected.filter(
    //                 (chip) => chip !== dynamicValue
    //             );
    //         } else {
    //             updatedChips = [...prevSelected, dynamicValue];
    //         }

    //         if (updatedChips.length === 0) {
    //             setFilters({});
    //         }

    //         return updatedChips;
    //     });

    //     if (dynamicValue === "following") {
    //         if (selectedChips.includes(dynamicValue)) {
    //             setFilters({});
    //         } else {
    //             console.log(
    //                 "Using stored following data:",
    //                 followingUsers,
    //                 following
    //             );
    //             setFilters((prevFilters) => ({
    //                 ...prevFilters,
    //                 eventOwners: followingUsers,
    //                 venueId: following,
    //                 artists: following,
    //                 attendees: followingUsers,
    //             }));
    //         }
    //     } else {
    //         setFilters((prevFilters) => {
    //             const updatedFilters = { ...prevFilters };

    //             if (!updatedFilters[filterKey]) {
    //                 updatedFilters[filterKey] = [];
    //             }

    //             if (updatedFilters[filterKey].includes(dynamicValue)) {
    //                 updatedFilters[filterKey] = updatedFilters[
    //                     filterKey
    //                 ].filter((item) => item !== dynamicValue);

    //                 if (
    //                     Object.keys(updatedFilters).every(
    //                         (key) => updatedFilters[key].length === 0
    //                     )
    //                 ) {
    //                     return {};
    //                 }
    //             } else {
    //                 updatedFilters[filterKey] = [
    //                     ...updatedFilters[filterKey],
    //                     dynamicValue,
    //                 ];
    //             }

    //             return updatedFilters;
    //         });
    //     }
    // };

    // --- initial -
    // const handleChipClick = (category, option) => {
    //     const scrollY = window.scrollY;

    //     const filterKey = category.toLowerCase();

    //     const dynamicValue = getNormalizedFilterValue(filterKey, option);

    //     setSelectedChips((prevSelected) => {
    //         let updatedChips;

    //         if (prevSelected.includes(dynamicValue)) {
    //             updatedChips = prevSelected.filter(
    //                 (chip) => chip !== dynamicValue
    //             );
    //         } else {
    //             updatedChips = [...prevSelected, dynamicValue];
    //         }

    //         setFilters((prevFilters) => {
    //             const updatedFilters = { ...prevFilters };

    //             if (!updatedFilters[filterKey]) {
    //                 updatedFilters[filterKey] = [];
    //             }

    //             if (updatedFilters[filterKey].includes(dynamicValue)) {
    //                 updatedFilters[filterKey] = updatedFilters[
    //                     filterKey
    //                 ].filter((item) => item !== dynamicValue);
    //                 if (updatedFilters[filterKey].length === 0) {
    //                     delete updatedFilters[filterKey];
    //                 }
    //             } else {
    //                 updatedFilters[filterKey] = [
    //                     ...updatedFilters[filterKey],
    //                     dynamicValue,
    //                 ];
    //             }

    //             console.log(
    //                 updatedFilters
    //             );

    //             localStorage.setItem("scrollPosition", scrollY);

    //             return updatedFilters;
    //         });

    //         return updatedChips;
    //     });
    // };

    const getDynamicFilterValue = (option, category = "") => {
        const today = new Date();

        switch (option) {
            case "Today":
                return formatISO(today, { representation: "date" });
            case "Tomorrow":
                return formatISO(new Date(today.setDate(today.getDate() + 1)), {
                    representation: "date",
                });
            case "Upcoming":
                return {
                    greaterThan: formatISO(today, { representation: "date" }),
                };
            case "Past":
                return {
                    lessThan: formatISO(today, { representation: "date" }),
                };
            default:
                return getNormalizedFilterValue(category, option);
        }
    };

    const getNormalizedFilterValue = (key, option) => {
        if (key === "categories") {
            return option
                .toLowerCase()
                .replace(/\s(.)/g, (match) => match.toUpperCase().trim())
                .replace(/\s/g, "");
        }

        return option.toLowerCase();
    };

    return (
        <div
            ref={ref}
            className={`${styles.filterBar} ${searchFixed ? "fixed top-[70px] left-0 z-[1500]" : "relative z-[500]"}`}
        >
            <div className="flex flex-col items-center justify-between gap-2 w-[300px]">
                <Input
                    placeholder="Search events"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.input}
                />

                <Select
                    value={selectedSearchType}
                    onChange={setSelectedSearchType}
                    className={styles.select}
                    defaultSelectedKeys={["events"]}
                >
                    <SelectItem key="events" value="events">
                        Event
                    </SelectItem>
                    <SelectItem key="users" value="users">
                        Venue
                    </SelectItem>
                    <SelectItem key="locations" value="locations">
                        Locations
                    </SelectItem>
                </Select>
            </div>

            <div className={styles.filterContainer}>
                <button onClick={scrollLeft} className={styles.arrowButton}>
                    <Icon
                        icon="mdi:chevron-left"
                        className="text-3xl z-[100]"
                    />
                </button>

                <div ref={filtersRef} className={styles.filters}>
                    {activeFilters.map((filter) => (
                        <div
                            key={filter.id}
                            className={`${styles.filterBox} ${filter.label === "Categories" ? styles.largerBox : ""}`}
                        >
                            <button
                                onClick={() => removeFilter(filter.id)}
                                className={styles.removeButton}
                            >
                                <Icon icon="mdi:close" className="text-xl" />
                            </button>

                            <span className={styles.filterLabel}>
                                {filter.label}
                            </span>

                            <div
                                className={`${filter.label === "Categories" ? styles.chipContainerLarger : styles.chipContainer}`}
                            >
                                {filter.options.map((option, index) => (
                                    <Chip
                                        key={index}
                                        size="sm"
                                        onClick={() =>
                                            handleChipClick(
                                                filter.label,
                                                option
                                            )
                                        }
                                        radius="sm"
                                        variant="bordered"
                                        className={`${styles.chip} ${selectedChips.includes(getDynamicFilterValue(option)) ? styles.activeChip : ""}`}
                                        startContent={
                                            selectedChips.includes(
                                                getDynamicFilterValue(option)
                                            ) && (
                                                <Icon
                                                    icon="ci:check"
                                                    width="24"
                                                    height="24"
                                                />
                                            )
                                        }
                                    >
                                        {option}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={scrollRight} className={styles.arrowButton}>
                    <Icon
                        icon="mdi:chevron-right"
                        className="text-3xl z-[100]"
                    />
                </button>
            </div>

            <Dropdown className={styles.dropdown} shouldBlockScroll={false}>
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
