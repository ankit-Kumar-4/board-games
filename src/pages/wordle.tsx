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

function checkAnagram(a: string, b: string) {

    // Not of same length, can't be Anagram
    if (a.length !== b.length) {
        return false;
    }

    // Inbuilt functions to rearrange the string
    let str1 = a.split('').sort().join('');
    let str2 = b.split('').sort().join('');

    let result = (str1 === str2);
    return result;
}

export default function Contact() {
    const [randomWord, setRandomWord] = useState<string | null>(null);
    const [originalWord, setOriginalWord] = useState<string>('');
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
        if (checkAnagram(userInput, originalWord) && words.includes(userInput)) {
            setResult('What a wild guess!')
        } else {
            setResult(`The correct answer is: ${originalWord}`)
        }
    }

    return (
        <>
            <FiveCharForm passValue={handleSubmit} inputLength={originalWord.length} />
            <p>{result}</p>
            <div className={styles["game-row"]}>
                {chacterList}
            </div>
        </>
    );
}
