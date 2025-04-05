import { useContext } from "react";
import { Card, Tooltip } from "@heroui/react";
import { AuthContext } from "../contexts/authContext";

export default function CalendarDate({ date, onPress }) {
    const { isAuth } = useContext(AuthContext);

    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    const formattedDate = new Date(date);

    return (
        <Tooltip
            content={`Open Calendar`}
            placement="top"
            closeDelay={1000}
            color="primary"
            offset={10}
            className="bg-slate-700 text-white rounded-lg"
            isDisabled={!isAuth}
        >
            <Card
                className="flex flex-col items-center justify-center p-4 w-28 h-[140px] bg-white text-black rounded-lg shadow-md"
                style={{
                    position: "absolute",
                    top: "120px",
                    left: "100px",
                    zIndex: 100,
                }}
                isPressable={isAuth}
                isHoverable
                onPress={() => {
                    onPress(true);
                }}
            >
                <span className="text-4xl font-bold font-primary text-primary">
                    {formattedDate.getDate()}
                </span>
                <span className="text-lg font-semibold font-primary mb-2">
                    {formattedDate.toLocaleString("en-US", { month: "long" })}
                </span>
                <span className="text-tiny opacity-70 text-gray-500">
                    Opening {formattedDate.toLocaleDateString("en-US", options)}
                </span>
            </Card>
        </Tooltip>
    );
}
