import React, {
    useState,
    useRef,
    forwardRef,
    useEffect,
    useContext,
} from "react";
import {
    Input,
    Select,
    SelectItem,
    Chip,
    Checkbox,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Autocomplete,
    AutocompleteItem,
    Skeleton,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { formatISO } from "date-fns";
import { useFollowing } from "../contexts/followingContext";
import styles from "./FilterBar.module.css";
import { useArtists } from "../hooks/useArtists";
import { useVenues } from "../hooks/useVenues";
import { doc, collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../contexts/authContext";
import authApi from "../api/auth-api";
import { useUser } from "../hooks/useUser-new";

const FilterBar = forwardRef(({ searchFixed, setFilters }, ref) => {
    const { userId, isAuth } = useContext(AuthContext);
    const { currentUser, loading: userLoading } = useUser();

    const { followingUsers, followingArtists, followingVenues } =
        useFollowing();
    const {
        artists,
        loading: artistsLoading,
        error: artistsError,
    } = useArtists();
    const { venues, loading: venuesLoading, error: venuesError } = useVenues();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSearchType, setSelectedSearchType] = useState("events");
    const [selectedChips, setSelectedChips] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [filterWidth, setFilterWidth] = useState("1150px");

    useEffect(() => {
        const width = isAuth ? "950px" : "1150px";
        setFilterWidth(width);
    }, [isAuth]);

    useEffect(() => {
        if (selectedSearchType === "events") {
            if (searchTerm) {
                setFilters((prev) => ({
                    ...prev,
                    title: searchTerm,
                }));
            } else {
                setFilters((prev) => {
                    const { title, ...rest } = prev;
                    return rest;
                });
            }
        }
        if (searchTerm === "") {
            setFilters((prev) => {
                const newFilters = { ...prev };

                if (selectedSearchType === "events") {
                    delete newFilters.title;
                } else if (selectedSearchType === "artist") {
                    delete newFilters.artists;
                } else if (selectedSearchType === "venue") {
                    delete newFilters.venues;
                }

                return newFilters;
            });
        }
    }, [searchTerm, selectedSearchType, setFilters]);

    function onArtistSelected(artistId) {
        setFilters((prev) => ({
            ...prev,
            artists: [artistId],
        }));
    }

    function onVenueSelected(venueId) {
        console.log("---search venue id", venueId);

        setFilters((prev) => ({
            ...prev,
            venue: venueId,
        }));
    }

    useEffect(() => {
        if (selectedSearchType === "events") {
            setSuggestions([]);
        } else if (selectedSearchType === "venue") {
            if (searchTerm.length > 0 && venues.length > 0) {
                const filteredVenues = venues.filter((venue) =>
                    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSuggestions(
                    filteredVenues.map((venue) => ({
                        key: venue.id,
                        label: venue.name,
                    }))
                );
            } else {
                setSuggestions([]);
            }
        } else if (selectedSearchType === "artist") {
            if (searchTerm.length > 0 && artists.length > 0) {
                const filteredArtists = artists.filter((artist) =>
                    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setSuggestions(
                    filteredArtists.map((artist) => ({
                        key: artist.id,
                        label: artist.name,
                    }))
                );
            } else {
                setSuggestions([]);
            }
        }
        console.log("--- search - ", searchTerm, " - ", selectedSearchType);
    }, [searchTerm, selectedSearchType, venues, artists]);

    const defaultFilterOptions = {
        Categories: [
            "Artist Talk",
            "Workshop",
            "Conference",
            "Sound",
            "Presentation",
            "Exhibition",
            "Other",
        ],
        Recommended: ["For you", "AI Picks"],
        Time: ["Today", "Tomorrow", "Upcoming", "Past"],
        Popular: ["Interested", "Attended", "Invitations", "Trending"],
        Involved: [
            "Following Artists",
            "Following Users",
            "Following Venues",
            "Invited",
            "Inviting",
        ],
    };

    const [activeFilters, setActiveFilters] = useState([]);

    const [availableFilters] = useState([
        "Categories",
        "Recommended",
        "Time",
        "Popular",
        "Involved",
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
                {
                    id: Date.now(),
                    label: filterLabel,
                    options: defaultFilterOptions[filterLabel] || [],
                },
            ]);
        }
    };

    const generateDefaultFilters = () =>
        Object.entries(defaultFilterOptions).map(([label, options]) => ({
            id: Date.now() + label,
            label,
            options,
        }));

    useEffect(() => {
        if (userLoading) return;

        if (currentUser) {
            if (
                !currentUser.activeFilters ||
                currentUser.activeFilters.length === 0
            ) {
                setActiveFilters(generateDefaultFilters());
            } else {
                setActiveFilters(currentUser.activeFilters);
            }
        } else {
            setActiveFilters(generateDefaultFilters());
        }
    }, [currentUser, userLoading]);

    useEffect(() => {
        if (activeFilters && activeFilters.length > 0) {
            authApi.updateUser(userId, { activeFilters });
        }
    }, [activeFilters, userId]);

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

    const getTimeChipValue = (option) => option.toLowerCase();

    // --- last -
    const handleChipClick = (category, option) => {
        if (category === "Time") {
            const chipId = getTimeChipValue(option);
            if (selectedChips.includes(chipId)) {
                setSelectedChips((prev) =>
                    prev.filter((chip) => chip !== chipId)
                );
                if (option === "Past") {
                    setFilters((prev) => {
                        const { eventEndDate, ...rest } = prev;
                        return rest;
                    });
                } else {
                    setFilters((prev) => {
                        const { openingDate, ...rest } = prev;
                        return rest;
                    });
                }
                return;
            }
            switch (option) {
                case "Today": {
                    const isoDate = new Date().toISOString().slice(0, 10);
                    setFilters((prev) => ({
                        ...prev,
                        openingDate: { equalTo: isoDate },
                    }));
                    break;
                }
                case "Tomorrow": {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const isoDate = tomorrow.toISOString().slice(0, 10);
                    setFilters((prev) => ({
                        ...prev,
                        openingDate: { equalTo: isoDate },
                    }));
                    break;
                }
                case "Upcoming": {
                    const isoToday = new Date().toISOString().slice(0, 10);
                    setFilters((prev) => ({
                        ...prev,
                        openingDate: { greaterThan: isoToday },
                    }));
                    break;
                }
                case "Past": {
                    const isoToday = new Date().toISOString().slice(0, 10);
                    setFilters((prev) => ({
                        ...prev,
                        eventEndDate: { lessThan: isoToday },
                    }));
                    break;
                }
                default:
                    break;
            }
            setSelectedChips((prev) => [...prev, chipId]);
            return;
        }

        if (category === "Popular") {
            const chipId = option.toLowerCase();
            if (selectedChips.includes(chipId)) {
                setSelectedChips((prev) =>
                    prev.filter((chip) => chip !== chipId)
                );
                setFilters((prev) => {
                    const { popular, categories, ...rest } = prev;
                    return rest;
                });
                return;
            }
            switch (option) {
                case "Interested":
                    setFilters((prev) => ({
                        ...prev,
                        popular: {
                            field: "interestedCount",
                            greaterThan: 1,
                            sort: "desc",
                        },
                    }));
                    break;
                case "Attended":
                    setFilters((prev) => ({
                        ...prev,
                        popular: {
                            field: "attendingCount",
                            greaterThan: 2,
                            sort: "desc",
                        },
                    }));
                    break;
                case "Invitations":
                    setFilters((prev) => ({
                        ...prev,
                        popular: {
                            field: "invitedCount",
                            greaterThan: 10,
                            sort: "desc",
                        },
                    }));
                    break;
                case "Trending":
                    setFilters((prev) => ({
                        ...prev,
                        categories: ["popular"],
                        popular: {
                            field: "interestedCount",
                            limit: 10,
                            sort: "desc",
                        },
                    }));
                    break;

                default:
                    break;
            }

            setSelectedChips((prev) => [...prev, chipId]);
            return;
        }

        const filterKey = category.toLowerCase();

        const dynamicValue = getNormalizedFilterValue(filterKey, option);

        sessionStorage.setItem("scrollPosition", window.scrollY);

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

        if (category === "Involved") {
            const involvedValue = option.toLowerCase();

            if (selectedChips.includes(involvedValue)) {
                setSelectedChips((prev) =>
                    prev.filter((chip) => chip !== involvedValue)
                );
                setFilters((prev) => {
                    const newFilters = { ...prev };
                    if (involvedValue === "following artists") {
                        delete newFilters.artists;
                    } else if (involvedValue === "following venues") {
                        delete newFilters.venue;
                    } else if (involvedValue === "following users") {
                        delete newFilters.involvedUsers;
                    } else if (involvedValue === "invited") {
                        delete newFilters.invited;
                    } else if (involvedValue === "inviting") {
                        delete newFilters.inviting;
                    }
                    return newFilters;
                });
                return;
            }

            if (involvedValue === "following artists") {
                setFilters((prev) => ({
                    ...prev,
                    artists: followingArtists,
                }));
            } else if (involvedValue === "following venues") {
                setFilters((prev) => ({
                    ...prev,
                    venue: followingVenues,
                }));
            } else if (involvedValue === "following users") {
                setFilters((prev) => ({
                    ...prev,
                    involvedUsers: followingUsers,
                }));
            } else if (involvedValue === "invited") {
                setFilters((prev) => ({
                    ...prev,
                    invited: [userId],
                }));
            } else if (involvedValue === "inviting") {
                setFilters((prev) => ({
                    ...prev,
                    inviting: [userId],
                }));
            }

            setSelectedChips((prev) => [...prev, involvedValue]);
            return;
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

    const isLoading =
        (selectedSearchType === "artist" && artistsLoading) ||
        (selectedSearchType === "venue" && venuesLoading);

    return (
        <div
            ref={ref}
            className={`${styles.filterBar} ${searchFixed ? "fixed top-[70px] left-0 z-[1500] rounded-t-none" : "relative z-[500]"}`}
        >
            <div className="flex flex-col items-center justify-between gap-1 w-[300px]">
                {selectedSearchType === "events" ? (
                    <Input
                        placeholder="Search events"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        // className={styles.input}
                        className={`${styles.input} no-focus-outline`}
                        classNames={{
                            inputWrapper: [
                                "bg-white border-1 border-gray-300 overflow-hidden px-0",
                                "data-[focus=true]:bg-white",
                                "data-[focus-within=true]:bg-white",
                                "data-[hover=true]:bg-white",
                            ],
                            innerWrapper: [
                                "bg-white w-full",
                                "data-[focus=true]:bg-white",
                                "data-[focus-within=true]:bg-white",
                            ],
                            input: "bg-white, pl-3",
                        }}
                        variant="solid"
                        radius="sm"
                    />
                ) : isLoading ? (
                    <div className="text-gray-500">
                        Loading {selectedSearchType}...
                    </div>
                ) : (
                    <Autocomplete
                        placeholder={`Search ${selectedSearchType}`}
                        inputValue={searchTerm}
                        onInputChange={setSearchTerm}
                        listboxProps={{
                            emptyContent: "Enter a search query.",
                        }}
                        className={styles.input}
                        variant="flat"
                        radius="sm"
                        inputProps={{
                            classNames: {
                                inputWrapper: [
                                    "bg-white border-1 border-gray-300 overflow-hidden px-0",
                                    "data-[hover=true]:bg-white",
                                    "data-[focus=true]:bg-white",
                                    "data-[focus-within=true]:bg-white",
                                    "data-[focus-visible=true]:bg-white",
                                ],
                                innerWrapper: [
                                    "bg-white w-full",
                                    "data-[focus=true]:bg-white",
                                    "data-[focus-within=true]:bg-white",
                                ],
                                input: "bg-white pl-3 pr-3",
                            },
                        }}
                        classNames={{
                            endContentWrapper: "pr-3",
                        }}
                    >
                        {suggestions.map((item) => (
                            <AutocompleteItem
                                key={item.key}
                                value={item.label}
                                onPress={() => {
                                    if (selectedSearchType === "artist") {
                                        onArtistSelected(item.key);
                                    } else if (selectedSearchType === "venue") {
                                        onVenueSelected(item.key);
                                    }
                                }}
                            >
                                {item.label}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                )}

                {/*
                 */}
                <Select
                    selectedKeys={[selectedSearchType]}
                    onSelectionChange={(keys) => {
                        const newValue = Array.from(keys)[0];
                        setSelectedSearchType(newValue);
                    }}
                    className={styles.select}
                    variant="solid"
                    radius="sm"
                    classNames={{
                        trigger: [
                            "bg-white border-1 border-gray-300",
                            "data-[focus=true]:bg-white",
                            "data-[open=true]:bg-white",
                        ],
                    }}
                >
                    <SelectItem key="events">Event</SelectItem>
                    <SelectItem key="venue">Venue</SelectItem>
                    <SelectItem key="artist">Artist</SelectItem>
                </Select>
            </div>

            <div
                className={styles.filterContainer}
                style={{
                    width: filterWidth,
                }}
            >
                {isAuth && (
                    <button onClick={scrollLeft} className={styles.arrowButton}>
                        <Icon
                            icon="mdi:chevron-left"
                            className="text-3xl z-[100]"
                        />
                    </button>
                )}

                <div ref={filtersRef} className={styles.filters}>
                    {activeFilters.map((filter) => (
                        <div
                            key={filter.id}
                            className={`${styles.filterBox} ${filter.label === "Categories" || filter.label === "Involved" ? styles.largerBox : ""}`}
                        >
                            {isAuth && (
                                <button
                                    onClick={() => removeFilter(filter.id)}
                                    className={styles.removeButton}
                                >
                                    <Icon
                                        icon="mdi:close"
                                        className="text-sm hover:bg-white hover:rounded-full hover:p-[2px]"
                                    />
                                </button>
                            )}

                            <span className={styles.filterLabel}>
                                {filter.label}
                            </span>

                            <div
                                className={`${filter.label === "Categories" || filter.label === "Involved" ? styles.chipContainerLarger : styles.chipContainer}`}
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
                                        className={`${styles.chip} ${
                                            (
                                                filter.label === "Time"
                                                    ? selectedChips.includes(
                                                          getTimeChipValue(
                                                              option
                                                          )
                                                      )
                                                    : selectedChips.includes(
                                                          getDynamicFilterValue(
                                                              option
                                                          )
                                                      )
                                            )
                                                ? styles.activeChip
                                                : ""
                                        }`}
                                        startContent={
                                            (filter.label === "Time"
                                                ? selectedChips.includes(
                                                      getTimeChipValue(option)
                                                  )
                                                : selectedChips.includes(
                                                      getDynamicFilterValue(
                                                          option
                                                      )
                                                  )) && (
                                                <Icon
                                                    icon="ci:check"
                                                    width="14"
                                                    height="14"
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

                {isAuth && (
                    <button
                        onClick={scrollRight}
                        className={styles.arrowButton}
                    >
                        <Icon
                            icon="mdi:chevron-right"
                            className="text-3xl z-[100]"
                        />
                    </button>
                )}
            </div>

            {isAuth && (
                <Dropdown
                    className={styles.dropdown}
                    shouldBlockScroll={false}
                    closeOnSelect={false}
                    offset={20}
                    crossOffset={-25}
                >
                    <DropdownTrigger>
                        {/* <div> */}
                        <Button
                            variant="bordered"
                            shouldBlockScroll={false}
                            className="border-1 border-gray-300 rounded-lg p-10"
                        >
                            Filters
                        </Button>
                        {/* </div> */}
                    </DropdownTrigger>

                    <DropdownMenu>
                        {availableFilters.map((filter) => {
                            const isSelected = activeFilters.some(
                                (f) => f.label === filter
                            );

                            return (
                                <DropdownItem
                                    key={filter}
                                    textValue={filter}
                                    startContent={
                                        <Checkbox
                                            isSelected={isSelected}
                                            onValueChange={() =>
                                                toggleFilter(filter)
                                            }
                                            aria-label={`Select ${filter}`}
                                        />
                                    }
                                >
                                    {filter}
                                </DropdownItem>
                            );
                        })}
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    );
});

FilterBar.displayName = "FilterBar";
export default FilterBar;
