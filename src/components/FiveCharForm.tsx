import React, { useState } from "react";
import styles from "@/styles/wordle.module.css";

const FiveCharForm = ({ passValue, inputLength, initialValue }:
    {
        passValue: (items: string) => void;
        inputLength: number;
        initialValue: string;
    }) => {
    // const [inputValue, setInputValue] = useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase(); // Convert to uppercase
        passValue(value);
    };


    return (
        <div className={styles["game-row"]}>
            <form>
                <input
                    type="text"
                    value={initialValue}
                    onChange={handleChange}
                    maxLength={inputLength}
                    required
                />
            </form>
        </div>
    );
};

export default FiveCharForm;
