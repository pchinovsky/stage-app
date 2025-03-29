export function getPanelState(settings, isEventsPage) {
    const dockPosition = settings?.dockPosition ?? "top-left";
    const persistPosition = settings?.persistPosition;
    const lastPosition = settings?.lastPosition ?? {
        top: "13px",
        left: "16px",
    };

    const docked =
        !persistPosition ||
        (lastPosition?.top === "13px" &&
            (lastPosition?.left === "16px" || lastPosition?.left === "72.8%"));

    const pos = isEventsPage && persistPosition
        ? {
            top: lastPosition?.top || "13px",
            left: lastPosition?.left || "16px",
        }
        : {
            top: "13px",
            left: dockPosition === "top-left" ? "16px" : "72.8%",
        };

    return { pos, docked };
}
