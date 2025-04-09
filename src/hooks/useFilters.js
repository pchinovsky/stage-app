import { useState, useEffect, useContext } from "react";
import authApi from "../api/auth-api";
import { AuthContext } from "../contexts/authContext";
import { useUser } from "../hooks/useUser-new";
import { useFollowing } from "../contexts/followingContext";
import { useArtists } from "../hooks/useArtists";
import { useVenues } from "../hooks/useVenues";
import { getNormalizedFilterValue } from "../../utils/getNormalizedFilterValue";

export function useFilters(setFilters) {

    const { userId, isAuth } = useContext(AuthContext);
    const { currentUser, loading: userLoading } = useUser();

    const { followingUsers, followingArtists, followingVenues } =
        useFollowing();
    const { artists, loading: artistsLoading } = useArtists();
    const { venues, loading: venuesLoading } = useVenues();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSearchType, setSelectedSearchType] = useState("events");
    const [selectedChips, setSelectedChips] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);

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
                    delete newFilters.venue;
                }

                return newFilters;
            });
        }
    }, [searchTerm, selectedSearchType, setFilters]);

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
    }, [searchTerm, selectedSearchType, venues, artists]);

    useEffect(() => {
        if (!isAuth) {
            setActiveFilters(generateDefaultFilters());
            return;
        }

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
    }, [isAuth, currentUser, userLoading]);

    useEffect(() => {
        if (userId && activeFilters && activeFilters.length > 0) {
            authApi.updateUser(userId, { activeFilters });
        }
    }, [activeFilters, userId]);

    function onArtistSelected(artistId) {
        setFilters((prev) => ({
            ...prev,
            artists: [artistId],
        }));
    }

    function onVenueSelected(venueId) {
        setFilters((prev) => ({
            ...prev,
            venue: venueId,
        }));
    }

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

    const getTimeChipValue = (option) => option.toLowerCase();

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

    return {
        searchTerm,
        suggestions,
        venuesLoading,
        artistsLoading,
        activeFilters,
        selectedChips,
        selectedSearchType,
        setSearchTerm,
        setSelectedSearchType,
        setSelectedChips,
        setSuggestions,
        setActiveFilters,
        removeFilter,
        toggleFilter,
        onArtistSelected,
        onVenueSelected,
        handleChipClick,
        getTimeChipValue,
    };
}
