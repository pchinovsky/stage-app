import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Image,
    Button,
    Divider,
} from "@heroui/react";
import DropdownEl from "@/Dropdown";
import styles from "./EventCard.module.css";

export default function EventCard() {
    return (
        <Card isPressable={true} className={styles.card}>
            {/* <DropdownEl
                className={styles.drop}
            ></DropdownEl> */}
            {/* <button className={styles.ops}>Winter</button> */}
            {/* <div className={styles.cardContent}> */}
            <CardHeader className={styles.cardHeader}>
                <p className={styles.textTiny}>Daily Mix</p>
                <small className={styles.textDefault}>12 Tracks</small>
                <Divider className="my-4"></Divider>
                <h4 className={styles.textLarge}>FRONTEND RADIO</h4>
                {/* <Button
                    size="sm"
                    // color="primary"
                    className={styles.button}
                    // radius="full"
                    // variant="ghost"
                >
                    GO
                </Button> */}
            </CardHeader>
            <CardBody className={styles.cardBody}>
                <Image
                    alt="Card background"
                    className={styles.image}
                    src="https://scontent-sof1-1.xx.fbcdn.net/v/t39.30808-6/470578498_983595940464492_5159731646999552594_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=104&ccb=1-7&_nc_sid=75d36f&_nc_ohc=_Rvhtr7hQ7EQ7kNvgEHf9YL&_nc_oc=AdjELiMg-Md6GVwpYob6L__4SZ3f00UD_3JBgMmvASxdWRVwsDtMlOFAk6eUpBo_d6M&_nc_zt=23&_nc_ht=scontent-sof1-1.xx&_nc_gid=A6nI7U9oiW6y-q1_oKym2-h&oh=00_AYAL32E-ZRfEQrS35L-NA2fuw89-kdd2F3DQIYHEauuKJQ&oe=67C061D7"
                    width={370}
                    height={235}
                />
            </CardBody>
            {/* </div> */}
        </Card>
    );
}
