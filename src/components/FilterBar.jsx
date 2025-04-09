import { useState, useRef, forwardRef, useEffect, useContext } from "react";
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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { AuthContext } from "../contexts/authContext";
import { getDynamicFilterValue } from "../../utils/getDynamicFilterValue";
import { useFilters } from "../hooks/useFilters";
import styles from "./FilterBar.module.css";

const FilterBar = forwardRef(({ searchFixed, setFilters }, ref) => {
    const { isAuth } = useContext(AuthContext);

    const filtersRef = useRef(null);

    const [filterWidth, setFilterWidth] = useState("1150px");

    const {
        searchTerm,
        setSearchTerm,
        selectedSearchType,
        setSelectedSearchType,
        selectedChips,
        suggestions,
        activeFilters,
        removeFilter,
        toggleFilter,
        onArtistSelected,
        onVenueSelected,
        handleChipClick,
        getTimeChipValue,
        artistsLoading,
        venuesLoading,
    } = useFilters(setFilters);

    const [availableFilters] = useState([
        "Categories",
        "Time",
        "Popular",
        "Involved",
    ]);

    useEffect(() => {
        const width = isAuth ? "950px" : "1150px";
        setFilterWidth(width);
    }, [isAuth]);

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
                        area-label="Search events"
                        placeholder="Search events"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        area-label={`Search ${selectedSearchType}`}
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

                <Select
                    area-label="Search type"
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
                    marginLeft: isAuth ? "0" : "64px",
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
                                        isDisabled={
                                            filter.label === "Time" &&
                                            selectedChips.some(
                                                (chip) =>
                                                    chip !==
                                                        getTimeChipValue(
                                                            option
                                                        ) &&
                                                    filter.label === "Time"
                                            )
                                        }
                                        onClick={() =>
                                            handleChipClick(
                                                filter.label,
                                                option
                                            )
                                        }
                                        radius="lg"
                                        variant="bordered"
                                        classNames={{
                                            base: "p-2",
                                            content: `${
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
                                                    ? "text-white"
                                                    : "text-[10px] font-medium text-gray-500 hover:text-white"
                                            }`,
                                        }}
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
                                                    icon="ci:check-bold"
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
                    area-label="Filter options"
                    className={styles.dropdown}
                    shouldBlockScroll={false}
                    closeOnSelect={false}
                    offset={20}
                    crossOffset={-25}
                >
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            shouldBlockScroll={false}
                            className="border-1 border-gray-300 rounded-lg p-10"
                        >
                            Filters
                        </Button>
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
