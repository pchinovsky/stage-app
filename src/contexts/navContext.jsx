import { createContext, useState } from "react";

export const NavContext = createContext();

export function NavProvider({ children }) {
    const [navWhite, setNavWhite] = useState(false);

    return (
        <NavContext.Provider value={{ navWhite, setNavWhite }}>
            {children}
        </NavContext.Provider>
    );
}
