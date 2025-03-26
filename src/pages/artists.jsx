import { useState } from "react";
import { useArtists } from "../hooks/useArtists";
import ArtistCard from "../components/ProfileCard";
import DefaultLayout from "../layouts/default";
import ModalProfileCustom from "../components/ModalProfileCustom";
import ProfileCard from "../components/ProfileCard";
import { Skeleton } from "@heroui/react";

export default function ArtistsPage() {
    const { artists, loading } = useArtists();
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

    // if (loading) {
    //     return <div className="p-4">Loading artists…</div>;
    // }

    return (
        <DefaultLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Artists</h1>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto"
                    style={{ maxHeight: "80vh" }}
                >
                    {loading
                        ? Array(6)
                              .fill(0)
                              .map((_, index) => (
                                  <Skeleton key={index} className="rounded-lg">
                                      <div
                                          style={{
                                              width: "480px",
                                              height: "288px",
                                          }}
                                          className="rounded-lg"
                                      ></div>
                                  </Skeleton>
                              ))
                        : artists.map((artist) => (
                              <ArtistCard
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
                    {/* {artists.map((artist) => (
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
                    ))} */}
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
