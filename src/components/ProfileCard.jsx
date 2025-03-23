import React from "react";
import { Card, CardFooter, Image } from "@heroui/react";

export default function ProfileCard({ data, onClick, size }) {
    return (
        <Card
            isPressable
            onPress={onClick}
            className="relative"
            shadow="md"
            style={{
                width: size.width,
                height: size.height,
            }}
        >
            <Image
                src={data?.profileImage || data?.image}
                alt={data?.name}
                className="w-[480px] h-full object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 right-0 h-[100px] flex justify-center px-2 pb-2 z-10">
                {/* <CardFooter className="bg-white bg-opacity-90 rounded-lg shadow-sm px-3 py-2 w-full">
                    <div>
                        <h3 className="text-lg font-bold m-0 text-left">
                            {data.name}
                        </h3>
                        <p className="text-sm text-gray-600 m-0">
                            {data.description
                                ? data.description.length > 60
                                    ? data.description.substring(0, 60) + "..."
                                    : data.description
                                : "No description"}
                        </p>
                    </div>
                </CardFooter> */}
            </div>
        </Card>
    );
}
