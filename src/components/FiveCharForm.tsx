import React, { useEffect, useState } from "react";
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
        // const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); // Convert to uppercase
        const regexPattern = `^[A-Z]{0,${inputLength}}$`;
        const regex = new RegExp(regexPattern);
        if (regex.test(value)) {
            passValue(value);
        }
    };


    const renderUnderscores = () => {
        const underscores = [];
        for (let i = 0; i < inputLength; i++) {
            let char = initialValue.length > i ? initialValue[i] : '_';
            underscores.push(
                <div key={i} className={styles.underscore}>
                    {char}
                </div>
            );
        }
        return underscores;
    };

    return (
        <div className={styles["game-row"]}>
            <form className={styles.form}>
                <div className={styles.underscoreContainer}>
                    {renderUnderscores()}
                </div>
                <input
                    type="text"
                    value={initialValue}
                    onChange={handleChange}
                    maxLength={inputLength}
                    className={styles.input}
                    required
                />
            </form>
        </div>
    );
};

export default FiveCharForm;
