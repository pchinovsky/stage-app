import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Form,
    Input,
    Textarea,
    Button,
    Select,
    SelectItem,
    DatePicker,
    TimeInput,
    Spinner,
    Tooltip,
    Chip,
} from "@heroui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DefaultLayout from "../layouts/default";
import { useArtists } from "../hooks/useArtists";
import { useVenue } from "../hooks/useVenue";
import { eventSchema } from "../api/validationSchemas";
import useForm from "../hooks/useForm";
import useEventEdit from "../hooks/useEventEdit";
import eventsApi from "../api/events-api";
import { parseDate, parseTime } from "@internationalized/date";
import { ArtistInput } from "../components/ArtistInput";
import TooltipProfile from "../components/TooltipProfile";
import { categories } from "../constants/generalConstants";
import { ImageUploadInput } from "../components/Image2";

export default function Edit() {
    const { eventId } = useParams();
    const navigate = useNavigate();
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
        interested: [],
        attending: [],
        startTime: "",
        endTime: "",
        openingDate: "",
        eventEndDate: "",
        artists: [],
        venue: "",
        createdBy: "",
    };

    const {
        formValues,
        setFormValues,
        handleInputChange,
        handleInputChangeExpanded,
        handleSubmit,
        isSubmitting,
        resetForm,
        error,
        loadingEvent,
    } = useEventEdit(eventId, initialValues);

    // useEffect(() => {
    //     if (formValues.image) {
    //         setPreviewImage(formValues.image);
    //     }
    // }, [formValues.image]);

    useEffect(() => {
        if (!loadingEvent && formValues.image) {
            setPreviewImage(formValues.image);
        }
    }, [loadingEvent, formValues.image]);

    useEffect(() => {
        console.log("Background image updated to:", formValues.image);
    }, [formValues.image]);

    const { artists: allArtists, loading: loadingArtists } = useArtists();
    const { artists: selectedArtists } = useArtists(formValues.artists);

    useEffect(() => {
        console.log("Updated form values:", formValues);
    }, [formValues]);

    const handleSubmitWithConversion = async (e) => {
        e.preventDefault();

        const formattedValues = {
            ...formValues,
            startTime:
                formValues.startTime && typeof formValues.startTime === "object"
                    ? `${String(formValues.startTime.hour).padStart(2, "0")}:${String(formValues.startTime.minute).padStart(2, "0")}`
                    : formValues.startTime,
            endTime:
                formValues.endTime && typeof formValues.endTime === "object"
                    ? `${String(formValues.endTime.hour).padStart(2, "0")}:${String(formValues.endTime.minute).padStart(2, "0")}`
                    : formValues.endTime,
        };

        try {
            console.log("Submitting with formatted values:", formattedValues);
            await handleSubmit(e);
            console.log("Successfully updated");
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleSubmitWithDebug = async (e) => {
        e.preventDefault();

        console.log("Submitting form with values:", formValues);

        try {
            await eventsApi.updateEvent(eventId, formValues);
            navigate(`/events/${eventId}`);
        } catch (err) {
            console.error("Error updating event:", err);
        }
    };

    const handleArtistChange = (updatedArtists) => {
        setFormValues((prev) => ({
            ...prev,
            artists: updatedArtists.map((artist) => artist.id),
        }));
    };

    const removeArtist = (artist) => {
        setFormValues((prev) => ({
            ...prev,
            artists: prev.artists.filter((id) => id !== artist.id),
        }));
    };

    const backgroundStyle =
        previewImage || formValues.image
            ? {
                  //   backgroundImage: `url(${previewImage || formValues.image})`,
                  backgroundImage: `url("${previewImage || formValues.image}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "white",
              }
            : {};

    return (
        <DefaultLayout>
            <div
                className="container p-6 w-[900px] mx-auto mt-[-20px] border border-slate-300 rounded-xl h-[80%]"
                style={backgroundStyle}
            >
                <div className="flex justify-between items-start mb-5">
                    <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
                    <div className="flex gap-2 self-start">
                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={isSubmitting}
                            onPress={() => formRef.current?.requestSubmit()}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            variant="flat"
                            color="danger"
                            onPress={resetForm}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
                {loadingEvent ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner
                            classNames={{
                                wrapper: "w-16 h-16",
                            }}
                        />
                    </div>
                ) : (
                    <Form
                        ref={formRef}
                        onSubmit={handleSubmitWithConversion}
                        // onSubmit={handleSubmitWithDebug}
                        className="flex gap-5"
                        style={{ flexDirection: "row" }}
                    >
                        <div className="flex flex-col gap-5 w-full h-full">
                            <Input
                                label="Event Title"
                                name="title"
                                value={formValues.title}
                                onChange={handleInputChange}
                                isInvalid={!!error?.title}
                                errorMessage={error?.title?.[0]}
                                isRequired
                            />

                            <Input
                                label="Event Subtitle"
                                name="subtitle"
                                value={formValues.subtitle}
                                onChange={handleInputChange}
                                isInvalid={!!error?.subtitle}
                                errorMessage={error?.subtitle?.[0]}
                                isRequired
                            />

                            <Select
                                label="Categories"
                                placeholder="Select event categories"
                                selectedKeys={formValues.categories || []}
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

                            <Textarea
                                label="Description"
                                name="description"
                                value={formValues.description}
                                onChange={handleInputChangeExpanded}
                                isInvalid={!!error?.description}
                                errorMessage={error?.description?.[0]}
                                isRequired
                                maxRows={8}
                            />
                        </div>

                        <div className="flex flex-col gap-5 w-full">
                            <div className="flex gap-5 w-full">
                                <DatePicker
                                    label="Opening Date"
                                    value={
                                        formValues.openingDate
                                            ? parseDate(formValues.openingDate)
                                            : undefined
                                    }
                                    onChange={(value) => {
                                        setFormValues((prev) => ({
                                            ...prev,
                                            openingDate: value
                                                .toDate("UTC")
                                                .toISOString()
                                                .split("T")[0],
                                        }));
                                    }}
                                    isInvalid={!!error?.openingDate}
                                    errorMessage={error?.openingDate?.[0]}
                                    className="flex-grow-1 flex-shrink-1"
                                />

                                <DatePicker
                                    label="End Date"
                                    value={
                                        formValues.eventEndDate
                                            ? parseDate(formValues.eventEndDate)
                                            : undefined
                                    }
                                    onChange={(value) => {
                                        setFormValues((prev) => ({
                                            ...prev,
                                            eventEndDate: value
                                                .toDate("UTC")
                                                .toISOString()
                                                .split("T")[0],
                                        }));
                                    }}
                                    isInvalid={!!error?.eventEndDate}
                                    errorMessage={error?.eventEndDate?.[0]}
                                    className="flex-grow-1 flex-shrink-1"
                                />
                            </div>

                            <div className="flex gap-5 w-full">
                                <TimeInput
                                    label="Start Time"
                                    name="startTime"
                                    value={formValues.startTime}
                                    // onChange={handleInputChangeExpanded}
                                    onChange={(value) =>
                                        setFormValues((prev) => ({
                                            ...prev,
                                            startTime: value,
                                        }))
                                    }
                                    isInvalid={!!error?.startTime}
                                    errorMessage={error?.startTime?.[0]}
                                    className="w-1/2"
                                />

                                <TimeInput
                                    label="End Time"
                                    name="endTime"
                                    value={formValues.endTime}
                                    // onChange={handleInputChangeExpanded}
                                    onChange={(value) =>
                                        setFormValues((prev) => ({
                                            ...prev,
                                            endTime: value,
                                        }))
                                    }
                                    isInvalid={!!error?.endTime}
                                    errorMessage={error?.endTime?.[0]}
                                    className="w-1/2"
                                />
                            </div>

                            <div className="flex flex-grow gap-5 w-full h-[56px]">
                                <ImageUploadInput
                                    formValues={formValues}
                                    setFormValues={setFormValues}
                                    previewImage={previewImage}
                                    setPreviewImage={setPreviewImage}
                                    error={error}
                                />
                            </div>
                            <div>
                                <ArtistInput
                                    artistList={allArtists}
                                    selectedArtists={selectedArtists}
                                    onChange={handleArtistChange}
                                    isInvalid={!!error?.artists}
                                    errorMessage={error?.artists?.[0]}
                                />

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {selectedArtists.map((artist) => (
                                        <Tooltip
                                            key={artist.id}
                                            content={
                                                <TooltipProfile data={artist} />
                                            }
                                            placement="right"
                                            showArrow
                                            className="py-0 px-0"
                                        >
                                            <Chip
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

                            {/* <Input
                                label="Venue Id"
                                value={formValues.venue}
                                isReadOnly
                            /> */}

                            {/* <div className="flex gap-2 self-end">
                                <Button
                                    type="submit"
                                    color="primary"
                                    isDisabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Changes"}
                                </Button>
                                <Button
                                    variant="flat"
                                    color="danger"
                                    onPress={resetForm}
                                >
                                    Reset
                                </Button>
                            </div> */}
                        </div>
                    </Form>
                )}
            </div>
        </DefaultLayout>
    );
}
