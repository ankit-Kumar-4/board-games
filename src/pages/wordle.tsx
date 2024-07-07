'use client';

import { useEffect, useState } from "react";
import { words } from "@/data/words";
import styles from "@/styles/wordle.module.css";
import FiveCharForm from "@/components/FiveCharForm";

function Square({ value, onSquareClick, isClicked }: { value: string; onSquareClick: any, isClicked: boolean }) {
    return (
        <button className={`${styles['square-margin']} ${isClicked ? styles.clicked : ''}`} onClick={onSquareClick} >
            {value}
        </button >
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

function getHintText(value: string, hint: number) {
    let output = '';
    for (let i = 0; i < value.length; i++) {
        if (i < hint) {
            output += value[i];
        } else {
            output += '#';
        }
    }
    return output;
}

export default function Contact() {
    const [randomWord, setRandomWord] = useState<string | null>(null);
    const [originalWord, setOriginalWord] = useState<string>('');
    const [result, setResult] = useState('');
    const [hint, setHint] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [charStates, setCharStates] = useState<boolean[]>(Array(5).fill(false));

    function refreshWord() {
        const index = getRandomInt(words.length);
        const shuffledWord = shuffleString(words[index]);
        setRandomWord(shuffledWord);
        setOriginalWord(words[index]);
        setResult('');
        setHint(0);
        setInputValue('');
        setCharStates(Array(originalWord.length).fill(false));
    }

    function resetWord() {
        console.log(hint);
        setInputValue(originalWord.slice(0, hint));
        setCharStates(Array(originalWord.length).fill(false));
    }

    useEffect(() => {
        refreshWord();
    }, []);

    if (!randomWord) {
        return <div>Loading...</div>;
    }

    function handleClick(char: string, index: number) {
        if (charStates[index]) {
            return;
        }
        const nextCharStates = charStates.slice();
        nextCharStates[index] = true;
        setCharStates(nextCharStates);

        const currentValue = inputValue + char;
        setInputValue(currentValue);
        if (currentValue.length === originalWord.length) {
            if (checkAnagram(currentValue, originalWord) && words.includes(currentValue)) {
                if (hint === 0) {
                    setResult('What a wild guess!');
                } else {
                    setResult('Finally got it right!');
                }
            } else {
                if (hint >= originalWord.length - 1) {
                    setResult(`Wrong! The correct answer is: ${originalWord}`);
                } else {
                    setResult(`Invalid answer. Hint: ${getHintText(originalWord, hint + 1)}`);
                    setHint(hint + 1);
                }
            }
        }
    }

    const chacterList = randomWord.split('').map((char, index) => (
        <Square key={index} value={char} isClicked={charStates[index]} onSquareClick={() => handleClick(char, index)} />
    ));


    function newGame(text: string, refreshFunction: () => void) {
        return (
            <button className={styles['new-game-button']} onClick={() => refreshFunction()}>{text}</button>
        )
    }
    const renderUnderscores = () => {
        const underscores = [];
        for (let i = 0; i < originalWord.length; i++) {
            let char = inputValue.length > i ? inputValue[i] : '_';
            underscores.push(
                <div key={i} className={`${styles.underscore} ${styles.underscore}`}>
                    {char}
                </div>
            );
        }
        return underscores;
    };

    return (
        <>
            <div className={styles['game-row']}>
                {renderUnderscores()}
            </div>
            <h3 className={styles['game-row']}>{result}</h3>
            <div className={styles["game-row"]}>
                {chacterList}
            </div>
            <div className={styles["game-row"]}>
                <div className={styles['square-margin']}>
                    {newGame('Reset!', resetWord)}
                </div>
                {newGame('New Game!', refreshWord)}
            </div>
        </>
    );
}
