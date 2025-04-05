export const getNormalizedFilterValue = (key, option) => {
    if (key === "categories") {
        return option
            .toLowerCase()
            .replace(/\s(.)/g, (match) => match.toUpperCase().trim())
            .replace(/\s/g, "");
    }

    return option.toLowerCase();
};