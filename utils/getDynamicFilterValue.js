import { formatISO } from "date-fns";
import { getNormalizedFilterValue } from "./getNormalizedFilterValue";

export const getDynamicFilterValue = (option, category = "") => {
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