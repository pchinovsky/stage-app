// Key for filters (avoids useEffect infinite loops with obj deps)
export const getFiltersKey = (filters) => {
    if (!filters || typeof filters !== "object") return "default";
    try {
        return JSON.stringify(filters);
    } catch (err) {
        console.error("Error stringifying filters:", err);
        return "error";
    }
};