import React from 'react';
// import { Link } from 'react-router-dom';
import Link from 'next/link';

const ImageComponent = () => {
    return (
        <div className="relative inline-block">
            <img
                src="https://i.imgflip.com/2wgh5p.png"
                alt="Responsive image"
                className="block w-full h-auto"
            />
            <div className="absolute top-8 left-7 md:top-24 md:left-28 text-blue-100 md:text-3xl">
                <Link href="/tic-tac-toe" legacyBehavior>Tic-tac-toe</Link>
            </div>
            <div className="absolute top-14 right-16 md:top-36 md:right-52 text-gray-300 md:text-3xl">
                <Link href="/wordle" legacyBehavior>Wordle</Link>

            </div>
            <div className="absolute top-32 left-24 text-wrap text-gray-300 md:text-3xl">
                <Link href="/snake-n-ladder" legacyBehavior>Snake-n-Ladder</Link>

            </div>
            <div className="absolute top-44 right-8 text-gray-300 md:text-3xl">
                <Link href="/2048" legacyBehavior>2048</Link>

            </div>
            <div className="absolute top-52 left-14 text-gray-300 md:text-3xl">
                <Link href="/sudoku" legacyBehavior>Sudoku</Link>

            </div>
            <div className="absolute top-64 right-28 text-black md:text-3xl">
                <Link href="https://asutosh-tetris.vercel.app/" legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer">Tetris</a>
                </Link>
            </div>
            <div className='absolute bottom-10 left-14 text-white'> My Website</div>
        </div>
    );
}

export default ImageComponent;
