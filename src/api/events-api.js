import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const createEvent = async (eventData) => {
    console.log("--- createEvent - eventData", eventData);

    try {
        const eventsCollection = collection(db, "events");
        const docRef = await addDoc(eventsCollection, eventData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding event: ", error);
        throw error;
    }
};

const createArtist = async (artistData) => {
    console.log("--- createArtist - artistData", artistData);

    try {
        const artistsCollection = collection(db, "artists");
        const docRef = await addDoc(artistsCollection, artistData);

        return { id: docRef.id, ...artistData };
    } catch (error) {
        console.error("Error adding artist: ", error);
        throw error;
    }
};

const getEvents = async () => {
    try {
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        const eventList = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return eventList;
    } catch (error) {
        console.error("Error fetching events: ", error);
        throw error;
    }
};

const getEventById = async (eventId) => {
    try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        return { id: eventSnap.id, ...eventSnap.data() };
    } catch (error) {
        console.error("Error fetching event: ", error);
        throw error;
    }
};

const updateEvent = async (eventId, updatedEvent) => {
    const formattedEvent = {
        ...updatedEvent,
        startTime: updatedEvent.startTime && typeof updatedEvent.startTime === 'object'
            ? updatedEvent.startTime.toString()
            : updatedEvent.startTime,
        endTime: updatedEvent.endTime && typeof updatedEvent.endTime === 'object'
            ? updatedEvent.endTime.toString()
            : updatedEvent.endTime,
    };

    return updateDoc(doc(db, "events", eventId), formattedEvent);
}

const deleteEvent = async (eventId) => {
    try {
        await deleteDoc(doc(db, "events", eventId));
    } catch (err) {
        console.error("Err deleting event:", err);
        throw err;
    }
};

export default {
    getEvents,
    getEventById,
    createEvent,
    createArtist,
    updateEvent,
    deleteEvent,
};