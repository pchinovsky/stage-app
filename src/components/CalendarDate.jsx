import { Card } from "@heroui/react";

export default function CalendarDate({ date, onPress }) {
    const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    const formattedDate = new Date(date);

    return (
        <Card
            className="flex flex-col items-center justify-center p-4 w-28 h-auto bg-white text-black rounded-lg shadow-md"
            style={{
                position: "absolute",
                top: "120px",
                left: "100px",
                zIndex: 100,
            }}
            isPressable
            onPress={() => {
                onPress(true);
            }}
        >
            <span className="text-4xl font-bold">
                {formattedDate.getDate()}
            </span>
            <span className="text-lg font-semibold">
                {formattedDate.toLocaleString("en-US", { month: "short" })}
            </span>
            <span className="text-sm opacity-70">
                {formattedDate.toLocaleDateString("en-US", options)}
            </span>
        </Card>
    );
}
