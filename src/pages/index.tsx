import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

const ImageComponent = () => {
    return (
        <>
            <Head>
                <title>Board Games by Ankit</title>
                <meta name="description" content="Welcome to The Board Games by Ankit! Here you can play multiple classic board games. Online multiplayer with friends also supported." />
                <meta name="keywords" content="board games by ankit, 2048 by ankit, snake and ladders by ankit, dots and boxes by ankit, scramble by ankit, sudoku by ankit, tic tac toe by ankit" />
                <meta name="author" content="Ankit Kumar" />
                <meta property="og:title" content="Board Games by Ankit - Home" />
                <meta property="og:description" content="Welcome to The Board Games by Ankit! Here you can play multiple classic board games. Online multiplayer with friends also supported." />
                <meta property="og:image" content="https://example.com/og-image.jpg" />
                <meta property="og:url" content="hhttps://games-by-ankit.vercel.app" />
                <meta name="twitter:title" content="Board Games by Ankit - Home" />
                <meta name="twitter:description" content="Welcome to The Board Games by Ankit! Here you can play multiple classic board games. Online multiplayer with friends also supported." />
                <meta name="twitter:image" content="https://example.com/twitter-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://games-by-ankit.vercel.app/" />
            </Head>
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
                <div className="absolute top-[266px] right-20 md:top-[670px] md:right-[220px] text-white md:text-3xl"
                    style={{ textShadow: '2px 2px 4px rgba(29, 47, 47, 0.5)' }}>
                    <Link href="/dots-n-boxes" legacyBehavior>Dots & Boxes</Link>
                </div>
                <div className='absolute bottom-10 left-14 md:bottom-40 md:left-32 md:text-7xl text-white'> My Website</div>
            </div>
        </>
    );
}

export default ImageComponent;
