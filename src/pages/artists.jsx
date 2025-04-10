import { useState } from "react";
import { Skeleton } from "@heroui/react";
import { useArtists } from "../hooks/useArtists";
import ProfileCard from "../components/ProfileCard";
import DefaultLayout from "../layouts/default";
import ModalProfileCustom from "../components/ModalProfileCustom";

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

    return (
        <DefaultLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Artists</h1>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto"
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
                              <ProfileCard
                                  key={artist.id}
                                  data={artist}
                                  onClick={() => handleCardClick(artist)}
                                  size={{
                                      width: "480px",
                                      height: "288px",
                                  }}
                                  styles={{
                                      text: "text-lg",
                                      desc: 150,
                                      footer: "h-[100px]",
                                      pos: "self-end",
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
