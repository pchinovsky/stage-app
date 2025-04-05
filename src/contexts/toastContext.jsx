import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = useCallback((message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
                message={toastMessage}
                onClose={() => setToastMessage(null)}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
