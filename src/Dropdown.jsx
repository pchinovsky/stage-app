import { useMemo, useState } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { Button } from "@heroui/button";
import styles from "./Dropdown.module.css";

export default function MyDropdown() {
    const [selectedKeys, setSelectedKeys] = useState(
        new Set()
    );

    const selectedValue = useMemo(
        () =>
            Array.from(selectedKeys)
                .join(", ")
                .replace(/_/g, ""),
        [selectedKeys]
    );

    return (
        <Dropdown className={styles.dropdown}>
            <DropdownTrigger>
                <Button className={styles.button}>
                    {selectedValue || "Select an option"}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                disallowEmptySelection
                aria-label="Single selection example"
                selectedKeys={selectedKeys}
                selectionMode="single"
                color="primary"
                onSelectionChange={(keys) =>
                    setSelectedKeys(keys)
                }
            >
                <DropdownItem
                    key="text"
                    className={styles.dropdownItem}
                >
                    Text
                </DropdownItem>
                <DropdownItem
                    key="number"
                    className={styles.dropdownItem}
                >
                    Number
                </DropdownItem>
                <DropdownItem
                    key="date"
                    className={styles.dropdownItem}
                >
                    Date
                </DropdownItem>
                <DropdownItem
                    key="single_date"
                    className={styles.dropdownItem}
                >
                    Single Date
                </DropdownItem>
                <DropdownItem
                    key="iteration"
                    className={styles.dropdownItem}
                >
                    Iteration
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
