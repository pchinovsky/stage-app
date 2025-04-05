import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useForm(initialValues, fetchFn, route, schema) {
    const [formValues, setFormValues] = useState(initialValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleInputChangeExpanded = (e, customField, customValue) => {
        if (e?.target) {
            const { name, value } = e.target;
            setFormValues((prevValues) => ({
                ...prevValues,
                [name]: value,
            }));
        } else if (customField && customValue !== undefined) {
            setFormValues((prevValues) => ({
                ...prevValues,
                [customField]: customValue,
            }));
        }
    };

    const resetForm = () => setFormValues(initialValues);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        console.log("useForm - form values", formValues);

        // zod validation
        if (schema) {
            const validation = schema.safeParse(formValues);
            if (!validation.success) {
                const formattedErrors = validation.error.flatten().fieldErrors;
                setError(formattedErrors);
                setIsSubmitting(false);
                return;
            }
        }

        try {
            await fetchFn(formValues);
            setFormValues(initialValues);
            setIsSubmitting(false);
            if (route) navigate(route);
        } catch (err) {
            setError(err.message || "An error occurred.");
        }
    };

    return {
        formValues,
        setFormValues,
        handleInputChange,
        handleInputChangeExpanded,
        handleSubmit,
        isSubmitting,
        resetForm,
        error,
    };
}
