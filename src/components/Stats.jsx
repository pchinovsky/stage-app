import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function StatsBox({ stats }) {
    return (
        <div className="absolute left-[70px] top-[410px] flex flex-wrap justify-end gap-4 z-[100] w-[400px]">
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    className="w-44 h-40 p-2 rounded-xl shadow-md bg-gray-900 text-white 
                               transition-transform transform hover:scale-105"
                    style={{
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <CardHeader className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                            {stat.label}
                        </span>
                        <Icon
                            icon={stat.icon}
                            className="text-3xl text-blue-400"
                        />
                    </CardHeader>
                    <CardBody className="text-center p-0">
                        <h2 className="text-4xl font-bold">{stat.value}</h2>
                        <p className="text-sm text-gray-400">
                            {stat.description}
                        </p>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
