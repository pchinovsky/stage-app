export function getSplitFilters(filters = {}) {
    const safeFilters = {};
    const postFilters = {};

    let usedArray = false;

    for (const [key, val] of Object.entries(filters)) {
        const isArrayType = Array.isArray(val);

        if (isArrayType && usedArray) {
            postFilters[key] = val;
        } else {
            safeFilters[key] = val;
            if (isArrayType) usedArray = true;
        }
    }

    return [safeFilters, postFilters];
}
