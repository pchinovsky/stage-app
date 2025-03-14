import React, { useState } from "react";
import { useVenues } from "../hooks/useVenues";
import DefaultLayout from "../layouts/default";
import ModalProfileCustom from "../components/ModalProfileCustom";
import ProfileCard from "../components/ProfileCard";

export default function VenuesPage() {
    const { venues, loading, error } = useVenues();
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCardClick = (venue) => {
        setSelectedVenue(venue);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedVenue(null);
    };

    if (loading) {
        return <div className="p-4">Loading venues…</div>;
    }
    if (error) {
        return <div className="p-4">Error loading venues.</div>;
    }

    return (
        <DefaultLayout>
            <div className="p-4 h-full mt-20">
                <h1 className="text-2xl font-bold mb-4">Venues</h1>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto"
                    style={{ maxHeight: "80vh" }}
                >
                    {venues.map((venue) => (
                        <ProfileCard
                            key={venue.id}
                            data={venue}
                            onClick={() => handleCardClick(venue)}
                        />
                    ))}
                </div>
                <ModalProfileCustom
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    data={selectedVenue}
                />
            </div>
        </DefaultLayout>
    );
}
