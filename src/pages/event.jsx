import { useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Image, Spinner, Skeleton } from "@heroui/react";
import MultiAccordion from "../components/AccordeonMulti";
import CalendarDate from "../components/CalendarDate";
import CalendarModal from "../components/Calendar";

import OwnerGuard from "../guards/OwnerGuard";
import { useArtists } from "../hooks/useArtists";
import { useVenue } from "../hooks/useVenue";
import { useUser } from "../hooks/useUser";
import { useEvent } from "../hooks/useEvent";
import { useError } from "../contexts/errorContext";
import { AuthContext } from "../contexts/authContext";
import useEventDelete from "../hooks/useEventDelete";
import styles from "./event.module.css";

import DefaultLayout from "../layouts/default";
import Toggle from "../components/Toggle";
import Engaged from "../components/Engaged";
import StatsBox from "../components/Stats";
import EventHead from "../components/EventHead";
import ArtistList from "../components/ArtistList";
import Discussion from "../components/Discussion";
import ModalInvite from "../components/ModalInvite";
import SlidingSidebar from "../components/Sidebar";
import ButtonDynamicGroup from "../components/ButtonDynamicGroup";
import ModalProfileCustom from "../components/ModalProfileCustom";

export default function Event() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const { isAuth } = useContext(AuthContext);
    const { showError } = useError();

    const { event, loading, error } = useEvent(eventId);

    const { deleteEvent, isDeleting } = useEventDelete();

    const [artistIds, setArtistIds] = useState(null);
    const [venueId, setVenueId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isModalInviteOpen, setIsModalInviteOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedPanel, setSelectedPanel] = useState("About");
    const [tooltipExitDelay, setTooltipExitDelay] = useState(500);

    useEffect(() => {
        if (error) {
            showError(error.message || "An unexpected error occurred.");
        } else if (!loading && !event) {
            showError("Event not found.");
        }
    }, [error, loading]);

    useEffect(() => {
        if (!loading && event) {
            setVenueId(event.venue || null);
            setArtistIds(event.artists || []);
        }
    }, [loading, event]);

    const {
        currentUser,
        loading: userLoading,
        fetchUsersByIds,
        otherUsers,
        allUsers,
    } = useUser();

    const { venue, loading: venueLoading } = useVenue(venueId);
    const { artists, loading: artistsLoading } = useArtists(artistIds);

    useEffect(() => {
        if (event?.createdBy) {
            fetchUsersByIds([event.createdBy]);
        }
    }, [event?.createdBy]);

    const author = { id: event?.createdBy, ...otherUsers[event?.createdBy] };

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
            icon: "tabler:user-check",
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

    return (
        <DefaultLayout>
            <div
                className={styles.eventContainer}
                style={{ position: "relative" }}
            >
                {loading || !event ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner
                            classNames={{
                                wrapper: "w-16 h-16",
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <ModalInvite
                            isOpen={isModalInviteOpen}
                            onClose={handleCloseModalInvite}
                            users={allUsers}
                            currentUser={currentUser}
                            event={event}
                        />
                        <CalendarDate
                            date={event?.openingDate}
                            time={event?.startTime?.slice(0, 5)}
                            onPress={setIsCalendarOpen}
                        />
                        <CalendarModal
                            isOpen={isCalendarOpen}
                            onClose={() => setIsCalendarOpen(false)}
                        />
                        {isAuth && (
                            <ButtonDynamicGroup
                                pos={{
                                    top: "top-[585px]",
                                    left: "left-[100px]",
                                    flex: "flex-col",
                                }}
                                event={event}
                                onModalOpen={handleOpenModalInvite}
                            />
                        )}
                        <EventHead
                            event={event}
                            venue={venue}
                            venueLoading={venueLoading}
                            isModalOpen={isModalOpen}
                            handleOpenModal={handleOpenModal}
                        />
                        {/* Artists Section */}
                        {artistsLoading ? (
                            <div className="absolute right-[230px] top-[150px] z-[100]">
                                <Spinner size="lg" />
                            </div>
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
                            attendingIds={event?.attending || []}
                            interestedIds={event?.interested || []}
                        />

                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            transition={{ duration: 1 }}
                            className={styles.image}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    zIndex: 0,
                                }}
                            >
                                {loading ? (
                                    <Skeleton
                                        className={`${styles.image} h-[1080px] w-[1920px]`}
                                    />
                                ) : (
                                    <Image
                                        src={event?.image}
                                        alt={event?.title}
                                        className={styles.image}
                                    />
                                )}
                            </div>
                        </motion.div>

                        <StatsBox
                            stats={statsData}
                            pos={{
                                top: "410px",
                                left: "70px",
                            }}
                        />
                        <SlidingSidebar event={event} venue={venue} />

                        <ModalProfileCustom
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            title="Information"
                            className="z-[1000]"
                            data={modalContent}
                        ></ModalProfileCustom>
                        <Toggle
                            options={["About", "Discussion"]}
                            onChange={(panel) => setSelectedPanel(panel)}
                        />
                        <AnimatePresence mode="wait">
                            {selectedPanel === "About" && (
                                <motion.div
                                    key="about"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute top-[410px] left-[495px] z-[100]"
                                >
                                    <MultiAccordion
                                        sections={[
                                            {
                                                title: "Description",
                                                content: event?.description,
                                            },
                                            {
                                                title: "Related Content",
                                                content: event?.associatedLinks,
                                            },
                                            {
                                                title: "Venue",
                                                content: venue?.description,
                                            },
                                        ]}
                                    />
                                </motion.div>
                            )}

                            {selectedPanel === "Discussion" && (
                                <motion.div
                                    key="discussion"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute top-[410px] left-[495px] z-[100]"
                                >
                                    {userLoading ? (
                                        <div className="flex justify-center items-center h-[250px]">
                                            <Spinner size="lg" />
                                        </div>
                                    ) : (
                                        <Discussion
                                            eventId={event?.id}
                                            authorData={currentUser}
                                        />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <OwnerGuard ownerId={event?.createdBy} mode="display">
                            <div className={styles.controlsColumn}>
                                <Button
                                    onPress={handleEdit}
                                    color="primary"
                                    variant="faded"
                                >
                                    Edit Event
                                </Button>
                                <Button
                                    onPress={handleDelete}
                                    color="danger"
                                    disabled={isDeleting}
                                    variant="faded"
                                >
                                    {isDeleting
                                        ? "Deleting Event..."
                                        : "Delete Event"}
                                </Button>
                            </div>
                        </OwnerGuard>
                    </>
                )}
            </div>
        </DefaultLayout>
    );
}
