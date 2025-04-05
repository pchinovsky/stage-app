import { useEffect, useState, useRef } from "react";
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
import { parseDate } from "@internationalized/date";
import useEventEdit from "../hooks/useEventEdit";
import DefaultLayout from "../layouts/default";
import TooltipProfile from "../components/TooltipProfile";
import { useArtists } from "../hooks/useArtists";
import { ArtistInput } from "../components/ArtistInput";
import { ImageUploadInput } from "../components/ImageUploadInput";
import { categories } from "../constants/generalConstants";

export default function Edit() {
    const { eventId } = useParams();

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

    useEffect(() => {
        if (!loadingEvent && formValues.image) {
            setPreviewImage(formValues.image);
        }
    }, [loadingEvent, formValues.image]);

    const { artists: allArtists, loading: loadingArtists } = useArtists();
    const { artists: selectedArtists } = useArtists(formValues.artists);

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
            await handleSubmit(e);
        } catch (error) {
            console.error("Error updating event:", error);
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
                                {loadingArtists ? (
                                    <div className="flex justify-center items-center h-[56px]">
                                        <Spinner size="lg" />
                                    </div>
                                ) : (
                                    <ArtistInput
                                        artistList={allArtists}
                                        selectedArtists={selectedArtists}
                                        onChange={handleArtistChange}
                                        isInvalid={!!error?.artists}
                                        errorMessage={error?.artists?.[0]}
                                    />
                                )}

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
                        </div>
                    </Form>
                )}
            </div>
        </DefaultLayout>
    );
}
