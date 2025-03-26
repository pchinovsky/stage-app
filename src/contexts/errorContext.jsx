import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    const showError = (message) => {
        console.log("Setting error in context:", message);

        setError(message);
    };

    const clearError = () => {
        console.log("Clearing error in context");
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ error, showError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};
