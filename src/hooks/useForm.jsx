import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useForm(initialValues, fetchFn, route, schema) {
    const [formValues, setFormValues] = useState(initialValues);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const resetForm = () => setFormValues(initialValues);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("useForm - form values", formValues);

        // zod validation
        if (schema) {
            const validation = schema.safeParse(formValues);
            if (!validation.success) {
                setError(validation.error.errors[0].message);
                return;
            }
        }

        try {
            await fetchFn(formValues);
            setFormValues(initialValues);
            if (route) navigate(route);
        } catch (err) {
            setError(err.message || "An error occurred.");
        }
    };

    return {
        formValues,
        handleInputChange,
        handleSubmit,
        resetForm,
        error,
    };
}
