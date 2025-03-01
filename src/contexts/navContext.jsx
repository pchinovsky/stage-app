import React, {
    createContext,
    useState,
    useEffect,
} from "react";

export const NavContext = createContext();

export function NavProvider({ children }) {
    const [navWhite, setNavWhite] = useState(false);

    useEffect(() => {
        console.log("navWhite changed:", navWhite);
    }, [navWhite]);

    return (
        <NavContext.Provider
            value={{ navWhite, setNavWhite }}
        >
            {children}
        </NavContext.Provider>
    );
}
