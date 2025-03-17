import { useLayoutEffect } from "react";

export default function useRestoreScroll(deps = []) {
    useLayoutEffect(() => {
        const savedScrollY = sessionStorage.getItem("scrollPosition");
        if (savedScrollY) {
            window.scrollTo(0, parseInt(savedScrollY, 10));
            console.log("Restored scroll to:", savedScrollY);

            // sessionStorage.removeItem("scrollPosition");
        }
    }, deps);
}
