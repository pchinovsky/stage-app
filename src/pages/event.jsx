import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, Modal, Image, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import Accordeon from "../components/Accordeon";
import MultiAccordion from "../components/AccordeonMulti";
import CalendarDate from "../components/CalendarDate";
import CalendarModal from "../components/Calendar";

import styles from "./event.module.css";
import DefaultLayout from "../layouts/default";
import { FloatingCard } from "../components/FloatingCard";
import TooltipProfile from "../components/TooltipProfile";
import ModalProfile from "../components/ModalProfile";
import ModalProfileCustom from "../components/ModalProfileCustom";
import Engaged from "../components/Engaged";
import Toggle from "../components/Toggle";
import Discussion from "../components/Discussion";
import { useArtists } from "../hooks/useArtists";
import { useVenue } from "../hooks/useVenue";
import ArtistList from "../components/ArtistList";
import SlidingSidebar from "../components/Sidebar";
import StatsBox from "../components/Stats";
import ButtonDynamicGroup from "../components/ButtonDynamicGroup";
import EventHead from "../components/EventHead";
import { useUser } from "../hooks/useUser";
import { useEventsRealtime } from "../hooks/useEventsRealtime";
import useDeleteEvent from "../hooks/useDeleteEvent";
import ModalInvite from "../components/ModalInvite";

export default function Event() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    // const { events, loading, error } = useEvents({ id: eventId });
    const { events, loading, error } = useEventsRealtime({ id: eventId });

    const { deleteEvent, isDeleting } = useDeleteEvent();

    const event = events[0];

    const [artistIds, setArtistIds] = useState(null);
    const [venueId, setVenueId] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [sidebarData, setSidebarData] = useState(null);
    const [tooltipExitDelay, setTooltipExitDelay] = useState(500);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!loading && events.length > 0) {
            const event = events[0];
            setArtistIds(event.artists || []);
            setVenueId(event.venue || null);
        }
    }, [loading, events]);

    const { artists, loading: artistsLoading } = useArtists(artistIds);
    const { venue, loading: venueLoading } = useVenue(venueId);

    useEffect(() => {
        if (!event || artistsLoading || venueLoading) return;

        setSidebarData({
            artists: artists || [],
            categories: event.categories || [],
            createdBy: event.createdBy || "",
            venue: venue || "",
        });
    }, [event, artists, venue, artistsLoading, venueLoading]);

    console.log("artists", artists);
    console.log("venue", venue);

    // const sidebarData = {
    //     artists: artists || [],
    //     categories: event.categories || [],
    //     createdBy: event.createdBy || "",
    //     venue: venue || "",
    // };

    const [isExpanded, setIsExpanded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPanel, setSelectedPanel] = useState("About");
    const [showModal, setShowModal] = useState(false);
    const [isModalInviteOpen, setIsModalInviteOpen] = useState(false);

    const {
        currentUser,
        loading: userLoading,
        fetchUsersByIds,
        otherUsers,
        allUsers,
    } = useUser();

    useEffect(() => {
        if (event?.createdBy) {
            console.log(
                "Fetching user data for event creator:",
                event.createdBy
            );

            fetchUsersByIds([event.createdBy]);
        }
    }, [event?.createdBy]);

    // const author = otherUsers[event?.createdBy] || {};
    const author = { id: event?.createdBy, ...otherUsers[event?.createdBy] };

    console.log("author", otherUsers);
    console.log("author itself", author);

    const handleOpenModal = (content) => {
        setTooltipExitDelay(0);
        setModalContent(content);
        setIsModalOpen(true);
        setTimeout(
            () => console.log("- Modal State AFTER update -", isModalOpen),
            0
        );
    };

    const handleCloseModal = () => {
        console.log("Closing modal");
        setIsModalOpen(false);
        setModalContent(null);
        setTooltipExitDelay(500);
    };

    const handleEdit = () => {
        navigate(`/events/${eventId}/edit`);
    };

    const handleDelete = () => {
        deleteEvent(event.id);
    };

    const handleOpenModalInvite = () => {
        setIsModalInviteOpen(true);
    };

    const handleCloseModalInvite = () => {
        setIsModalInviteOpen(false);
    };

    const statsData = [
        {
            label: "Attendees",
            value: event?.attendingCount,
            description: "People attending",
            icon: "mdi:account-group",
        },
        {
            label: "Interested",
            value: event?.interestedCount,
            description: "People interested",
            icon: "mdi:star-outline",
        },
        {
            label: "Invited",
            value: event?.invitedCount,
            description: "People invited",
            icon: "tabler:user-plus",
        },
    ];

    const yourEvents = [
        { title: "Art Show-mow", date: "2025-03-10" },
        { title: "Music Festival-val", date: "2025-03-15" },
    ];

    const followedUsersEvents = [
        { title: "Gallery Opening with Protein Bars", date: "2025-03-12" },
        {
            title: "Tech Meetup with Bear Grills eating eyeballs",
            date: "2025-03-20",
        },
    ];

    console.log("calendar open - ", isCalendarOpen);

    return (
        <DefaultLayout>
            <div
                className={styles.eventContainer}
                style={{ position: "relative" }}
            >
                {loading ? (
                    <p className={styles.loading}>Loading...</p>
                ) : error ? (
                    <p className={styles.error}>Error: {error.message}</p>
                ) : !events.length ? (
                    <p className={styles.notFound}>Event not found.</p>
                ) : (
                    <>
                        <ModalInvite
                            isOpen={isModalInviteOpen}
                            onClose={handleCloseModalInvite}
                            users={allUsers}
                            currentUser={currentUser}
                            event={event.id}
                        />
                        <CalendarDate
                            date={event.openingDate}
                            onPress={setIsCalendarOpen}
                        />
                        <CalendarModal
                            isOpen={isCalendarOpen}
                            onClose={() => setIsCalendarOpen(false)}
                        />
                        <ButtonDynamicGroup
                            pos={{
                                top: "top-[585px]",
                                left: "left-[100px]",
                                flex: "flex-col",
                            }}
                            event={event}
                            onModalOpen={handleOpenModalInvite}
                        />
                        {/* <ButtonDynamicClick></ButtonDynamicClick>
                        <ButtonDynamicClick></ButtonDynamicClick>
                        <ButtonDynamicClick></ButtonDynamicClick> */}
                        <EventHead
                            event={event}
                            venue={venue}
                            venueLoading={venueLoading}
                            isModalOpen={isModalOpen}
                            handleOpenModal={handleOpenModal}
                        />
                        {/* Artists Section */}
                        {artistsLoading ? (
                            <p>Loading artists...</p>
                        ) : (
                            <ArtistList
                                artists={artists}
                                onClick={(artist) => handleOpenModal(artist)}
                                exitDelay={tooltipExitDelay}
                                isModalOpen={isModalOpen}
                            />
                        )}
                        <Engaged
                            author={{
                                id: author.id,
                                name: author.name || "Unknown",
                                image:
                                    author.image ||
                                    "https://example.com/default-avatar.jpg",
                            }}
                            attendingIds={event.attending || []}
                            interestedIds={event.interested || []}
                            trigger={trigger}
                        />
                        <Image
                            src={event.image}
                            alt={event.title}
                            className={styles.image}
                        />
                        <StatsBox stats={statsData} />;
                        <SlidingSidebar event={event} venue={venue} />
                        {/* <FloatingCard className="absolute top-[500px] left-20 w-60 p-4 z-[100]">
                            <div className="flex items-center gap-2">
                                <Icon
                                    icon="lucide:zap"
                                    className="text-yellow-500"
                                />
                                <span>{event.title}</span>
                            </div>
                        </FloatingCard> */}
                        {/* <MultiAccordion
                            sections={[
                                {
                                    title: "Description",
                                    content: "An amazing event happening soon!",
                                },
                                {
                                    title: "Event Statistics",
                                    content: "Attendees: 340, Interested: 1200",
                                },
                                {
                                    title: "Venue",
                                    content: "The Grand Arena, New York",
                                },
                            ]}
                            className="absolute top-[300px] left-[700px] z-[100]"
                        /> */}
                        {/* <ModalProfile
                            profile={{
                                name: event.venue,
                                image: "https://sarieva.org/data/i/2022-ECHO.jpg",
                                description:
                                    "This is an amazing venue for events.",
                            }}
                            isOpen={true}
                            onClose={() => setIsModalOpen(false)}
                        /> */}
                        {/* always-visible modal */}
                        {/* <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h2 className="text-xl font-bold">
                                    Test Modal
                                </h2>
                                <p>This modal should always be visible.</p>
                                <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                                    Close
                                </button>
                            </div>
                        </div> */}
                        <ModalProfileCustom
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            title="Information"
                            className="z-[1000]"
                            data={modalContent}
                        ></ModalProfileCustom>
                        {/* <Discussion
                            comments={comments}
                            onAddComment={addComment}
                        /> */}
                        <Toggle
                            options={["About", "Discussion"]}
                            onChange={(panel) => setSelectedPanel(panel)}
                        />
                        <motion.div
                            key={selectedPanel}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-[300px] left-[810px] z-[100]"
                        >
                            {selectedPanel === "About" ? (
                                <MultiAccordion
                                    sections={[
                                        {
                                            title: "Description",
                                            content: event.description,
                                        },
                                        {
                                            title: "Related Content",
                                            content: event.associatedLinks,
                                        },
                                        {
                                            title: "Venue",
                                            content:
                                                "The Grand Arena, New York",
                                        },
                                    ]}
                                />
                            ) : (
                                <Discussion
                                    // comments={comments}
                                    // onAddComment={addComment}
                                    eventId={event.id}
                                    authorData={currentUser}
                                />
                            )}
                        </motion.div>
                        <div className={styles.controlsColumn}>
                            <Button onPress={handleEdit} color="primary">
                                Edit Event
                            </Button>
                            <Button
                                onPress={handleDelete}
                                color="danger"
                                disabled={isDeleting}
                            >
                                {isDeleting
                                    ? "Deleting Event..."
                                    : "Delete Event"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </DefaultLayout>
    );
}
