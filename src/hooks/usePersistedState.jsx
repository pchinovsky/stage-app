import { useState, useEffect } from "react";

export default function usePersistedState(
    key,
    initialValue
) {
    const [isAuth, setIsAuth] = useState(false);

    console.log(
        "in persisted state - key/initVal - ",
        key,
        initialValue
    );

    const [state, setState] = useState(() => {
        const storedValue = localStorage.getItem(key);
        console.log(
            "in persisted state - val? - ",
            storedValue
        );

        if (storedValue) {
            setIsAuth(true);
            return storedValue;
        } else {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, state);
    }, [key, state]);

    return [state, setState, isAuth, setIsAuth];
}
