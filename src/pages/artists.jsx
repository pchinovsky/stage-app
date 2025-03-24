import { useState } from "react";
import { useArtists } from "../hooks/useArtists";
import ArtistCard from "../components/ProfileCard";
import DefaultLayout from "../layouts/default";
import ModalProfileCustom from "../components/ModalProfileCustom";
import ProfileCard from "../components/ProfileCard";

export default function ArtistsPage() {
    const { artists, loading, error } = useArtists();
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleCardClick = (artist) => {
        setSelectedArtist(artist);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedArtist(null);
    };

    if (loading) {
        return <div className="p-4">Loading artists…</div>;
    }
    if (error) {
        return <div className="p-4">Error loading artists.</div>;
    }

    return (
        <DefaultLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Artists</h1>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto"
                    style={{ maxHeight: "80vh" }}
                >
                    {artists.map((artist) => (
                        <ProfileCard
                            key={artist.id}
                            data={artist}
                            onClick={() => handleCardClick(artist)}
                            size={{
                                width: "480px",
                                height: "288px",
                            }}
                            footer={true}
                        />
                    ))}
                </div>
                <ModalProfileCustom
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    data={selectedArtist}
                />
            </div>
        </DefaultLayout>
    );
}
