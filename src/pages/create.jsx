import React from "react";
import {
    Form,
    Input,
    Textarea,
    Button,
    Select,
    SelectItem,
    Switch,
    DatePicker,
    TimeInput,
    Spinner,
    Chip,
    Link,
    Tooltip,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { ArtistInput } from "../components/ArtistInput";
import DefaultLayout from "../layouts/default";
import { FormLinks } from "../components/FormLinks";
import { ImageUrlInput } from "../components/Image";
import { useArtists } from "../hooks/useArtists";
import TooltipProfile from "../components/TooltipProfile";
import { useUser } from "../hooks/useUser";
import { useVenue } from "../hooks/useVenue";
import useForm from "../hooks/useForm";
import { eventSchema } from "../api/validationSchemas";
import eventsApi from "../api/events-api";
import DurationInput from "../components/DurationInput";
import ModalArtistAdd from "../components/ModalArtistAdd";
import { categories } from "../constants/generalConstants";
import {
    doc,
    updateDoc,
    setDoc,
    arrayUnion,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useError } from "../contexts/errorContext";
import { useEventCreate } from "../hooks/useEventCreate";
import { ImageUploadInput } from "../components/Image2";

export default function CreatePage() {
    const createEvent = useEventCreate();
    const [previewImage, setPreviewImage] = useState("");

    const formRef = useRef(null);

    const initialValues = {
        title: "",
        subtitle: "",
        description: "",
        image: "",
        categories: [],
        associatedLinks: [],
        invited: [],
        inviting: [],
        interested: [],
        attending: [],
        invitedCount: 0,
        interestedCount: 0,
        attendingCount: 0,
        involvedUsers: [],
        startTime: "",
        endTime: "",
        openingDate: "",
        eventEndDate: "",
        artists: [],
        venue: "",
        createdBy: "",
        createdAt: serverTimestamp(),
    };

    const route = "/events";

    const {
        formValues,
        setFormValues,
        handleInputChange,
        handleInputChangeExpanded,
        handleSubmit,
        isSubmitting,
        resetForm,
        error,
    } = useForm(initialValues, createEvent, route, eventSchema);

    const { artists: loadedArtists, loading: artistLoading } = useArtists();
    const { currentUser, loading: userLoading } = useUser();
    const [venueId, setVenueId] = useState(null);

    useEffect(() => {
        if (!artistLoading) {
            setArtists(loadedArtists);
        }
    }, [loadedArtists, artistLoading]);

    useEffect(() => {
        if (!userLoading && currentUser) {
            setVenueId(currentUser.managedVenue || null);
        }
    }, [userLoading, currentUser]);

    const { venue, loading: venueLoading } = useVenue(venueId);

    console.log("current user", currentUser);

    useEffect(() => {
        if (venue) {
            console.log("Updating formValues with venue:", venue.id);
            setFormValues((prevValues) => ({
                ...prevValues,
                venue: venue.id,
            }));
        }
    }, [venue]);

    useEffect(() => {
        if (currentUser) {
            console.log("Updating formValues with user:", currentUser.id);
            setFormValues((prevValues) => ({
                ...prevValues,
                createdBy: currentUser.id,
                involvedUsers: [currentUser.id],
            }));
        }
    }, [currentUser]);

    // const backgroundStyle = formValues.image
    //     ? {
    //           backgroundImage: `url(${formValues.image})`,
    //           backgroundSize: "cover",
    //           backgroundPosition: "center",
    //           color: "white",
    //       }
    //     : {};

    const backgroundStyle =
        previewImage || formValues.image
            ? {
                  backgroundImage: `url(${previewImage || formValues.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
              }
            : {};

    const [selectedArtists, setSelectedArtists] = useState([]);
    const [showArtistModal, setShowArtistModal] = useState(false);
    const [artists, setArtists] = useState([]);
    const [links, setLinks] = useState([]);

    const handleArtistChange = (updatedArtists) => {
        setSelectedArtists(updatedArtists);

        const artistIds = updatedArtists.map((artist) => artist.id);

        setFormValues((prevValues) => ({
            ...prevValues,
            artists: artistIds,
        }));
    };

    const removeArtist = (artist) => {
        const updatedArtists = selectedArtists.filter((a) => a !== artist);
        handleArtistChange(updatedArtists);
    };

    const handleLinksChange = (updatedLinks) => {
        setLinks(updatedLinks);
        setFormValues((prevValues) => ({
            ...prevValues,
            associatedLinks: updatedLinks,
        }));
    };

    const removeLink = (linkToRemove) => {
        const updatedLinks = links.filter((link) => link !== linkToRemove);
        handleLinksChange(updatedLinks);
    };

    const handleTimeChange = (value) => {
        console.log("Time change received:", value);

        if (
            value &&
            typeof value === "object" &&
            "hour" in value &&
            "minute" in value
        ) {
            const hours = value.hour.toString().padStart(2, "0");
            const minutes = value.minute.toString().padStart(2, "0");

            const timeString = `${hours}:${minutes}`;

            console.log("Formatted time string:", timeString);

            handleInputChangeExpanded(null, "startTime", timeString);
        } else {
            console.warn("Unexpected time value:", value);
        }
    };

    const handleEndTimeChange = (value) => {
        console.log("End Time change received:", value);

        if (
            value &&
            typeof value === "object" &&
            "hour" in value &&
            "minute" in value
        ) {
            const hours = value.hour.toString().padStart(2, "0");
            const minutes = value.minute.toString().padStart(2, "0");

            const timeString = `${hours}:${minutes}`;

            console.log("Formatted end time string:", timeString);

            handleInputChangeExpanded(null, "endTime", timeString);
        } else {
            console.warn("Unexpected end time value:", value);
        }
    };

    const handleArtistCreated = (newArtist) => {
        setSelectedArtists((prev) => [...prev, newArtist]);

        setFormValues((prevValues) => ({
            ...prevValues,
            artists: [...prevValues.artists, newArtist.id],
        }));

        setArtists((prev) => [...prev, newArtist]);
    };

    // if (userLoading) {
    //     return <div>Loading user data...</div>;
    // }

    return (
        <DefaultLayout>
            <div
                className="min-h-screen w-full transition-all duration-700 ease-in-out pt-10"
                // style={{
                //     backgroundImage: `url(${formValues?.image})`,
                //     backgroundSize: "cover",
                //     backgroundPosition: "center",
                //     color: "white",
                // }}
                style={backgroundStyle}
            >
                <div className="container mx-auto py-8 px-4">
                    <div
                        className={`w-[850px] h-[700px] mx-auto rounded-xl p-6 ${previewImage ? "bg-gray-50/20 backdrop-blur-md" : "bg-white border border-slate-300"}`}
                    >
                        <div className="flex justify-between items-start mb-5">
                            <h1
                                className={`text-3xl font-bold mb-6 ${previewImage ? "text-white" : "text-gray-800"}`}
                            >
                                Create Event
                            </h1>
                            <div className="flex justify-end gap-2 mt-4 h-[100%]">
                                <Button
                                    type="submit"
                                    color="primary"
                                    isDisabled={isSubmitting}
                                    startContent={
                                        isSubmitting ? (
                                            <Spinner size="sm" />
                                        ) : null
                                    }
                                    onPress={() =>
                                        formRef.current?.requestSubmit()
                                    }
                                >
                                    {isSubmitting
                                        ? "Staging in progress"
                                        : "Stage Event"}
                                </Button>
                                <Button
                                    variant="flat"
                                    color={
                                        formValues.image ? "default" : "danger"
                                    }
                                    onPress={resetForm}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>

                        <div>
                            <ModalArtistAdd
                                isOpen={showArtistModal}
                                onClose={() => setShowArtistModal(false)}
                                onArtistCreated={handleArtistCreated}
                                className="absolute left-10 top-10 z-[1000]"
                            />
                        </div>

                        <Form
                            ref={formRef}
                            className="flex flex-row gap-10"
                            onSubmit={handleSubmit}
                            validationBehavior="aria"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[500px]">
                                <div className="md:col-span-2"></div>
                                <ImageUploadInput
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    previewImage={previewImage}
                                    setPreviewImage={setPreviewImage}
                                    error={error}
                                />

                                <Input
                                    label="Event Title"
                                    name="title"
                                    placeholder="Enter event title"
                                    value={formValues.title}
                                    onChange={handleInputChange}
                                    isInvalid={!!error?.title}
                                    errorMessage={error?.title?.[0]}
                                    isRequired
                                    classNames={{
                                        label: formValues.image
                                            ? "text-white"
                                            : "",
                                        input: formValues.image
                                            ? "text-white"
                                            : "",
                                    }}
                                />

                                <Input
                                    label="Event Subtitle"
                                    placeholder="Enter event subtitle"
                                    name="subtitle"
                                    value={formValues.subtitle}
                                    onChange={handleInputChange}
                                    isInvalid={!!error?.subtitle}
                                    errorMessage={error?.subtitle?.[0]}
                                    isRequired
                                    classNames={{
                                        label: formValues.image
                                            ? "text-white"
                                            : "",
                                        input: formValues.image
                                            ? "text-white"
                                            : "",
                                    }}
                                />

                                <Select
                                    label="Category"
                                    placeholder="Select event categories"
                                    selectedKeys={formValues.categories || []}
                                    // onSelectionChange={(keys) =>
                                    //     setFormValues((prev) => ({
                                    //         ...prev,
                                    //         categories: Array.from(keys),
                                    //     }))
                                    // }
                                    onSelectionChange={(keys) =>
                                        handleInputChangeExpanded(
                                            null,
                                            "categories",
                                            Array.from(keys)
                                        )
                                    }
                                    isInvalid={!!error?.categories}
                                    errorMessage={error?.categories?.[0]}
                                    isRequired
                                    selectionMode="multiple"
                                    classNames={{
                                        label: formValues.image
                                            ? "text-white"
                                            : "",
                                        trigger: formValues.image
                                            ? "text-white"
                                            : "",
                                    }}
                                >
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <div className="md:col-span-2">
                                    <Textarea
                                        label="Description"
                                        name="description"
                                        placeholder="Describe your event"
                                        value={formValues.description}
                                        onChange={handleInputChangeExpanded}
                                        isInvalid={!!error?.description}
                                        errorMessage={error?.description?.[0]}
                                        minRows={3}
                                        isRequired
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <FormLinks
                                        links={formValues.associatedLinks || []}
                                        onChange={(updatedLinks) =>
                                            handleLinksChange(updatedLinks)
                                        }
                                        error={error}
                                    />
                                </div>

                                <div className="md:col-span-2 flex flex-wrap gap-2 max-w-80">
                                    {links.map((link) => (
                                        <Chip
                                            key={link}
                                            onClose={() => removeLink(link)}
                                            // className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap bg-white"
                                            className={
                                                formValues.image
                                                    ? "bg-white py-4 px-2"
                                                    : "bg-white border border-blue-600 py-4 px-2"
                                            }
                                        >
                                            <Link
                                                key={link}
                                                isExternal
                                                showAnchorIcon
                                                href={link}
                                                onClose={() => removeLink(link)}
                                                className="max-w-[350px] overflow-hidden text-ellipsis whitespace-nowrap"
                                            >
                                                <div className="py-2 text-blue-400">
                                                    {link}
                                                </div>
                                            </Link>
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"></div>

                                <DatePicker
                                    label="Opening Date"
                                    value={
                                        formValues.openingDate
                                            ? parseDate(formValues.openingDate)
                                            : undefined
                                    }
                                    onChange={(value) => {
                                        if (value) {
                                            const formattedDate = value
                                                .toDate("UTC")
                                                .toISOString()
                                                .split("T")[0];
                                            setFormValues((prevValues) => ({
                                                ...prevValues,
                                                openingDate: formattedDate,
                                            }));
                                        }
                                    }}
                                    isRequired
                                    isInvalid={!!error?.openingDate}
                                    errorMessage={error?.openingDate?.[0]}
                                    classNames={{
                                        label: formValues.image
                                            ? "text-white"
                                            : "",
                                        input: formValues.image
                                            ? "text-white"
                                            : "",
                                    }}
                                />

                                <TimeInput
                                    label="Opening Start Time"
                                    name="startTime"
                                    value={
                                        formValues.startTime
                                            ? new Time(
                                                  parseInt(
                                                      formValues.startTime.split(
                                                          ":"
                                                      )[0],
                                                      10
                                                  ),
                                                  parseInt(
                                                      formValues.startTime.split(
                                                          ":"
                                                      )[1],
                                                      10
                                                  )
                                              )
                                            : new Time(0, 0)
                                    }
                                    onChange={handleTimeChange}
                                    isRequired
                                    isInvalid={!!error?.startTime}
                                    errorMessage={error?.startTime?.[0]}
                                    classNames={{
                                        label: formValues.image
                                            ? "text-white"
                                            : "",
                                        input: formValues.image
                                            ? "text-white"
                                            : "",
                                    }}
                                />

                                <DatePicker
                                    label="End Date"
                                    value={
                                        formValues.eventEndDate
                                            ? parseDate(formValues.eventEndDate)
                                            : undefined
                                    }
                                    onChange={(value) => {
                                        if (value) {
                                            const formattedDate = value
                                                .toDate("UTC")
                                                .toISOString()
                                                .split("T")[0];
                                            setFormValues((prevValues) => ({
                                                ...prevValues,
                                                eventEndDate: formattedDate,
                                            }));
                                        }
                                    }}
                                    isInvalid={!!error?.eventEndDate}
                                    errorMessage={error?.eventEndDate?.[0]}
                                    classNames={{
                                        label: formValues.image
                                            ? "text-white"
                                            : "",
                                        input: formValues.image
                                            ? "text-white"
                                            : "",
                                    }}
                                />

                                <TimeInput
                                    label="Opening End Time"
                                    name="endTime"
                                    value={
                                        formValues.endTime
                                            ? new Time(
                                                  parseInt(
                                                      formValues.endTime.split(
                                                          ":"
                                                      )[0],
                                                      10
                                                  ),
                                                  parseInt(
                                                      formValues.endTime.split(
                                                          ":"
                                                      )[1],
                                                      10
                                                  )
                                              )
                                            : new Time(0, 0)
                                    }
                                    onChange={handleEndTimeChange}
                                    isRequired
                                    isInvalid={!!error?.endTime}
                                    errorMessage={error?.endTime?.[0]}
                                    classNames={{
                                        label: formValues.image
                                            ? "text-white"
                                            : "",
                                        input: formValues.image
                                            ? "text-white"
                                            : "",
                                    }}
                                />

                                <Input
                                    label="Venue"
                                    value={
                                        venueLoading
                                            ? "Loading venue..."
                                            : venue?.name || "No venue found"
                                    }
                                    isReadOnly
                                    className="md:col-span-2 mt-11"
                                />

                                <div className="md:col-span-2 flex flex-row gap-2">
                                    <ArtistInput
                                        artistList={artists}
                                        selectedArtists={selectedArtists}
                                        onChange={(updatedArtists) =>
                                            handleArtistChange(updatedArtists)
                                        }
                                        error={error}
                                    />
                                    <Button
                                        color="primary"
                                        onPress={() => setShowArtistModal(true)}
                                        isIconOnly
                                        className="h-full font-bold bg-blue-300"
                                    >
                                        +
                                    </Button>
                                </div>

                                <div className="md:col-span-2 flex flex-col gap-2">
                                    {selectedArtists.map((artist) => (
                                        <Tooltip
                                            key={artist.id}
                                            content={
                                                <TooltipProfile data={artist} />
                                            }
                                            placement="right"
                                            motionProps={{
                                                variants: {
                                                    exit: {
                                                        opacity: 0,
                                                        transition: {
                                                            duration: 0.2,
                                                            ease: "easeIn",
                                                        },
                                                    },
                                                    enter: {
                                                        opacity: 1,
                                                        transition: {
                                                            duration: 0.7,
                                                            ease: "easeOut",
                                                        },
                                                    },
                                                },
                                            }}
                                            closeDelay={500}
                                            className="py-0 px-0"
                                        >
                                            <Chip
                                                key={artist.id}
                                                onClose={() =>
                                                    removeArtist(artist)
                                                }
                                                className="bg-blue-500 text-white py-4 px-2 hover:bg-blue-400 cursor-pointer"
                                            >
                                                {artist.name}
                                            </Chip>
                                        </Tooltip>
                                    ))}
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
