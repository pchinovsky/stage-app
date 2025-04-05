import ProfileCard from "./ProfileCard";

export default function TooltipProfile({ data, onClick }) {
    if (!data) return null;

    return (
        <ProfileCard
            data={data}
            size={{ width: "170px", height: "170px" }}
            onClick={onClick}
            styles={{
                text: "text-sm",
                pos: "self-start",
                desc: 40,
                footer: "h-[80px]",
            }}
            footer={true}
        />
    );
}
