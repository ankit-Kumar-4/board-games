"use client";

import { useEffect, useState } from "react";
import { words } from "@/data/words";
import styles from "@/styles/scramble.module.css";
import Head from "next/head";
import { getRandomInt } from "@/utils/common-functions";


function Square({
  value,
  onSquareClick,
  isClicked,
}: Readonly<{ value: string; onSquareClick: any; isClicked: boolean }>) {
  return (
    <button
      className={`${styles["square-margin"]}  ${isClicked ? styles.clicked : ""
        }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function shuffleString(input: string): string {
  // Convert the string to an array of characters
  let characters = input.split("");

  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  // Convert the array back to a string
  return characters.join("");
}

function checkAnagram(a: string, b: string) {
  // Not of same length, can't be Anagram
  if (a.length !== b.length) {
    return false;
  }

  // Inbuilt functions to rearrange the string
  let str1 = a.split("").sort().join("");
  let str2 = b.split("").sort().join("");

  let result = str1 === str2;
  return result;
}

function getHintText(value: string, hint: number) {
  let output = "";
  for (let i = 0; i < value.length; i++) {
    if (i < hint) {
      output += value[i];
    } else {
      output += "#";
    }
  }
  return output;
}

export default function Scramble() {
  const [randomWord, setRandomWord] = useState<string>("");
  const [originalWord, setOriginalWord] = useState<string>("");
  const [result, setResult] = useState("");
  const [hint, setHint] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [charStates, setCharStates] = useState<boolean[]>(Array(5).fill(false));
  const [clickedChars, setClickedChars] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState(1);
  const [expanded, setExpanded] = useState(false);
  // const [difficulty, setDifficulty] = useState<number | null>(null);

  const handleButtonClick = (level: number) => {
    if (expanded) {
      setDifficulty(level);
      refreshWord(level);
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  function refreshWord(level: number) {
    const DIFFICULTY: { [key: number]: number } = {
      0: getRandomInt(1517),
      1: getRandomInt(2455) + 1517,
      2: getRandomInt(1676) + 3972
    }

    const index = DIFFICULTY[level];
    const shuffledWord = shuffleString(words[index]);
    setRandomWord(shuffledWord);
    setOriginalWord(words[index]);
    setResult("");
    setHint(0);
    setInputValue("");
    setCharStates(Array(originalWord.length).fill(false));
    setClickedChars([]);
  }

  function resetStates() {
    const nextStates = Array(originalWord.length).fill(false);
    for (let idx = 0; idx < hint; idx++) {
      const instances = randomWord
        .split("")
        .map((c, i) => (c === originalWord[idx] ? i : -1))
        .filter((i) => i !== -1);
      for (const index of instances) {
        if (!nextStates[index]) {
          nextStates[index] = true;
          break;
        }
      }
    }
    setCharStates(nextStates);
  }

  function resetWord() {
    setInputValue(originalWord.slice(0, hint));
    setCharStates(Array(originalWord.length).fill(false));
    resetStates();
    setClickedChars([]);
  }

  function undoWord() {
    if (inputValue.length === 0) {
      return;
    }
    if (inputValue.length === hint) {
      resetWord();
      return;
    }
    const nextCharStates = charStates;
    nextCharStates[clickedChars[clickedChars.length - 1]] = false;
    setCharStates(nextCharStates);
    setInputValue(inputValue.slice(0, -1));
    setClickedChars(clickedChars.slice(0, -1));
  }

  useEffect(() => {
    refreshWord(1);
  }, []);

  if (!randomWord) {
    return <div>Loading...</div>;
  }

  function handleClick(char: string, index: number) {
    if (charStates[index]) {
      return;
    }
    setClickedChars([...clickedChars, index]);
    const nextCharStates = charStates.slice();
    nextCharStates[index] = true;
    setCharStates(nextCharStates);

    const currentValue = inputValue + char;
    setInputValue(currentValue);
    if (currentValue.length === originalWord.length) {
      if (
        checkAnagram(currentValue, originalWord) &&
        words.includes(currentValue)
      ) {
        if (hint === 0) {
          setResult("What a wild guess!");
        } else {
          setResult("Finally got it right!");
        }
      } else if (hint >= originalWord.length - 1) {
        setResult(`Wrong! The correct answer is: ${originalWord}`);
      } else {
        setResult(
          `Invalid answer. Hint: ${getHintText(originalWord, hint + 1)}`
        );
        setHint(hint + 1);
      }
    }
  }

  const chacterList = randomWord
    .split("")
    .map((char, index) => (
      <Square
        key={index}
        value={char}
        isClicked={charStates[index]}
        onSquareClick={() => handleClick(char, index)}
      />
    ));

  function newGame(text: string, refreshFunction: (value: number) => void) {
    return (
      <button
        className={styles["new-game-button"]}
        onClick={() => refreshFunction(difficulty)}
      >
        {text}
      </button>
    );
  }
  const renderUnderscores = () => {
    const underscores = [];
    for (let i = 0; i < originalWord.length; i++) {
      let char = inputValue.length > i ? inputValue[i] : "_";
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
      <Head>
        <title>Scramble - Board Games by Ankit</title>
        <meta name="description" content="Test your vocabulary skills with Scramble. Unscramble the jumbled letters to find the correct word. Challenge yourself with different levels of difficulty!" />
        <meta name="keywords" content="scramble, word scramble, scramble game by ankit, word games, scramble by ankit, ankit" />
        <meta name="author" content="Ankit Kumar" />
        <meta property="og:title" content="Scramble - Board Games by Ankit" />
        <meta property="og:description" content="Test your vocabulary skills with Scramble. Unscramble the jumbled letters to find the correct word. Challenge yourself with different levels of difficulty!" />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
        <meta property="og:url" content="https://example.com" />
        <link rel="canonical" href="https://games-by-ankit.vercel.app/" />
      </Head>

      <div className="flex items-center mb-4 space-x-4">
        {/* Label */}
        <label className="text-gray-700 font-semibold">Difficulty:</label>

        {/* Button Group */}
        {!expanded ? (
          // Single button view
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded"
            onClick={() => setExpanded(true)}
          >
            {difficulty !== null ? ["Easy", "Medium", "Hard"][difficulty] : "Select Difficulty"}
          </button>
        ) : (
          // Expanded button view with animation
          <div className="flex space-x-2">
            {[0, 1, 2].map((level) => (
              <button
                key={level}
                className={`w-full py-2  ${difficulty === level ? "bg-green-400" : "bg-gray-300"
                  } text-white rounded`}
                onClick={() => handleButtonClick(level)}
              >
                {["Easy", "Medium", "Hard"][level]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles["game-row"]}>
        {renderUnderscores()}
        {newGame("↺", undoWord)}
      </div>
      <h3 className={styles["game-row"]}>{result}</h3>
      <div className={styles["game-row1"]}>{chacterList}</div>
      <div className={styles["game-row"]}>
        <div className={styles["square-margin"]}>
          {newGame("Reset!", resetWord)}
        </div>
        {newGame("New Game!", refreshWord)}
      </div>
    </>
  );
}
