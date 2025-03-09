import * as z from "zod";

export const registerSchema = z
    .object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const eventSchema = z
    .object({
        title: z.string().nonempty("Title is required"),
        subtitle: z.string().nonempty("Subtitle is required"),
        description: z.string().nonempty("Description is required"),
        image: z.string().url("Invalid URL"),
        categories: z
            .array(z.string())
            .nonempty("At least one category is required"),
        associatedLinks: z
            .array(z.string().url("Invalid URL"))
            .nonempty("At least one link is required"),
        startTime: z
            .string()
            .nonempty("Start time is required")
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
        endTime: z
            .string()
            .nonempty("End time is required")
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),

        openingDate: z.string().nonempty("Start date is required"),
        eventEndDate: z.string().nonempty("End date is required"),

        artists: z
            .array(z.string())
            .nonempty("At least one artist is required"),
        venue: z.string().nonempty("Venue is required"),
    })
    .refine((data) => {
        if (data.openingDate && data.startTime) {
            const openingDateTime = new Date(`${data.openingDate}T${data.startTime}`);
            return openingDateTime > new Date();
        }
        return false;
    }, {
        message: "Opening date and time must be in the future",
        path: ["openingDate"],
    })
    .refine((data) => {
        if (data.openingDate && data.startTime && data.eventEndDate && data.endTime) {
            const openingDateTime = new Date(`${data.openingDate}T${data.startTime}`);
            const endDateTime = new Date(`${data.eventEndDate}T${data.endTime}`);
            return endDateTime > openingDateTime;
        }
        return false;
    }, {
        message: "End date and time must be after the start date and time",
        path: ["eventEndDate"],
    });

