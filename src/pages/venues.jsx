import { useState } from "react";
import { Skeleton } from "@heroui/react";
import { useVenues } from "../hooks/useVenues";
import DefaultLayout from "../layouts/default";
import ModalProfileCustom from "../components/ModalProfileCustom";
import ProfileCard from "../components/ProfileCard";

export default function VenuesPage() {
    const { venues, loading } = useVenues();

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

    return (
        <DefaultLayout>
            <div className="p-4 h-full mt-20">
                <h1 className="text-2xl font-bold mb-4">Venues</h1>
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
                        : venues.map((venue) => (
                              <ProfileCard
                                  key={venue.id}
                                  data={venue}
                                  onClick={() => handleCardClick(venue)}
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
                    data={selectedVenue}
                />
            </div>
        </DefaultLayout>
    );
}
