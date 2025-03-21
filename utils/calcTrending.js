import { getDoc, updateDoc, doc } from "firebase/firestore";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { POPULAR_THRESHOLD } from "../src/constants/generalConstants";
import { db } from "../src/firebase/firebaseConfig";

/**
 * Calculate event counter total.
 * Determine the inclusion of 'Popular' category based on POPULAR_THRESHOLD constant.
 *
 * @param {string} eventId - The ID of the event record.
 */
export async function calcTrending(eventId) {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) return;
    const eventData = eventSnap.data();

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
        await updateDoc(eventRef, categoryUpdate);
    }
}
