import { getDoc, updateDoc, doc } from "firebase/firestore";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { POPULAR_THRESHOLD } from "../src/constants/generalConstants";
import { db } from "../src/firebase/firebaseConfig";
import eventsApi from "../src/api/events-api";

/**
 * Calculate and return event counter total.
 * Determine the inclusion of 'Popular' category based on POPULAR_THRESHOLD constant.
 *
 * @param {object} eventData - The full event document.
 */
export async function calcTrending(eventData) {

    const total =
        (eventData.interestedCount || 0) +
        (eventData.attendingCount || 0) +
        (eventData.invitedCount || 0);

    let categoryUpdate = {};

    if (total >= POPULAR_THRESHOLD) {
        if (!eventData.categories?.includes("popular")) {
            categoryUpdate = { categories: arrayUnion("popular") };
        }
    } else {
        if (eventData.categories?.includes("popular")) {
            categoryUpdate = { categories: arrayRemove("popular") };
        }
    }

    if (Object.keys(categoryUpdate).length > 0) {
        await eventsApi.updateEvent(eventData.id, categoryUpdate);
    }

    return total;
}
