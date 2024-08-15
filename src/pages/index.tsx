import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';

const ImageComponent = () => {
    return (
        <ProtectedRoute>
            <div className="relative inline-block">
                <Image
                    src="https://i.imgflip.com/2wgh5p.png"
                    alt="Responsive image"
                    width={10000}
                    height={10000}
                    className="block w-full h-auto"
                />
                <div className="absolute top-8 left-7 md:top-24 md:left-28 text-blue-100 md:text-3xl">
                    <Link href="/tic-tac-toe" legacyBehavior>Tic-tac-toe</Link>
                </div>
                <div className="absolute top-14 right-16 md:top-36 md:right-48 text-gray-300 md:text-3xl">
                    <Link href="/scramble" legacyBehavior>Scramble</Link>

                </div>
                <div className="absolute top-32 left-24 md:top-[340px] md:left-72 text-wrap text-gray-300 md:text-3xl">
                    <Link href="/snake-n-ladder" legacyBehavior>Snake-n-Ladder</Link>

                </div>
                <div className="absolute top-44 right-8 md:top-[440px] md:right-20 text-gray-300 md:text-3xl">
                    <Link href="/2048" legacyBehavior>2048</Link>

                </div>
                <div className="absolute top-52 left-14 md:left-40 md:top-[540px] text-gray-300 md:text-3xl">
                    <Link href="/sudoku" legacyBehavior>Sudoku</Link>

                </div>
                <div className="absolute top-64 right-28 md:top-[670px] md:right-72 text-black md:text-3xl">
                    <Link href="https://asutosh-swain.vercel.app/tetris" legacyBehavior>
                        <a target="_blank" rel="noopener noreferrer">Tetris</a>
                    </Link>
                </div>
                <div className='absolute bottom-10 left-14 md:bottom-40 md:left-32 md:text-7xl text-white'> My Website</div>
            </div>
        </ProtectedRoute>
    );
}

export default ImageComponent;
