'use client';

import { useEffect, useState } from "react";
import { words } from "@/data/words";
import styles from "@/styles/wordle.module.css";
import FiveCharForm from "@/components/FiveCharForm";

function Square({ value }: { value: string }) {
    return (
        <button className="square">
            {value}
        </button>
    );
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function shuffleString(input: string): string {
    // Convert the string to an array of characters
    let characters = input.split('');

    // Shuffle the array using the Fisher-Yates algorithm
    for (let i = characters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    // Convert the array back to a string
    return characters.join('');
}

export default function Contact() {
    const [randomWord, setRandomWord] = useState<string | null>(null);
    const [originalWord, setOriginalWord] = useState<string | null>(null);
    const [result, setResult] = useState('');

    useEffect(() => {
        const index = getRandomInt(words.length);
        const shuffledWord = shuffleString(words[index]);
        setRandomWord(shuffledWord);
        setOriginalWord(words[index]);
    }, []);

    if (!randomWord) {
        return <div>Loading...</div>;
    }

    const chacterList = randomWord.split('').map((char, index) => (
        <Square key={index} value={char} />
    ));

    function handleSubmit(userInput: string) {
        if (userInput === originalWord) {
            setResult('What a wild guess!')
        } else {
            setResult(`The correct answer is: ${originalWord}`)
        }
    }

    return (
        <>
            <FiveCharForm passValue={handleSubmit} />
            <p>{result}</p>
            <div className={styles["game-row"]}>
                {chacterList}
            </div>
        </>
    );
}
