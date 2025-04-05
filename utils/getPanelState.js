export function getPanelState(settings, isEventsPage) {
    const dockPosition = settings?.dockPosition ?? "top-left";
    const persist = settings?.persistPosition;
    const last = settings?.lastPosition;

    const dockStates = {
        "top-left": { x: 0, y: 0 },
        "top-right": { x: 1078, y: 0 },
    };

    const defaultDock = dockStates[dockPosition];

    const isDocked = last?.x === defaultDock.x && last?.y === defaultDock.y;
    const shouldUsePersisted = persist && last && isEventsPage && !isDocked;

    const pos = shouldUsePersisted ? last : defaultDock;
    const docked = shouldUsePersisted ? false : true;

    return { pos, docked, defaultDock };
}
