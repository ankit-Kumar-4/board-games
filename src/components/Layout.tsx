import { useState, ReactNode } from 'react';
import Link from 'next/link';
import ProfileMenu from '@/components/ProfileMenu';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import ChatIcon from '@/components/ChatIcon'

interface LayoutProps {
    children: ReactNode;
}


export default function Layout({ children }: LayoutProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-sidePanel shadow-md w-64 z-20`}>
                <div className="p-4 border-b border-green-600">
                    <h2 className="text-lg font-semibold text-white">My Games</h2>
                </div>
                <nav className="p-4">
                    <Link href="/" legacyBehavior>
                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sidePanelLink text-white"
                            onClick={() => setIsOpen(false)}>Home</div>
                    </Link>
                    <Link href="/tic-tac-toe" legacyBehavior>
                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sidePanelLink text-white"
                            onClick={() => setIsOpen(false)}>Tic-Tac-Toe</div>
                    </Link>
                    <Link href="/scramble" legacyBehavior>
                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sidePanelLink text-white"
                            onClick={() => setIsOpen(false)}>Scramble</div>
                    </Link>
                    <Link href="/snake-n-ladder" legacyBehavior>
                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sidePanelLink text-white"
                            onClick={() => setIsOpen(false)}>Snake & Ladder</div>
                    </Link>
                    <Link href="/2048" legacyBehavior>
                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sidePanelLink text-white"
                            onClick={() => setIsOpen(false)}>2048</div>
                    </Link>
                    <Link href="/sudoku" legacyBehavior>
                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sidePanelLink text-white"
                            onClick={() => setIsOpen(false)}>Sudoku</div>
                    </Link>
                    <div className="relative group">
                        <div className="block py-2.5 px-4 rounded transition duration-200 hover:bg-sidePanelLink text-white cursor-pointer"
                        onClick={toggleSubMenu}>
                            Games by Asutosh
                        </div>
                        {/* &#xfe40; : &gt; */}
                        <ul className={`absolute left-0 mt-1 w-full bg-sidePanel ${subMenuOpen ? ' ': 'hidden'}`}>
                            <li>
                                <a href="https://asutosh-swain.vercel.app/tetris" target="_blank" rel="noopener noreferrer"
                                    className="block py-2.5 px-4 hover:bg-sidePanelLink text-white">Tetris ↗</a>
                            </li>
                            <li>
                                <a href="https://asutosh-swain.vercel.app/snake" target="_blank" rel="noopener noreferrer"
                                    className="block py-2.5 px-4 hover:bg-sidePanelLink text-white">Snake ↗</a>
                            </li>
                            <li>
                                <a href="https://asutosh-swain.vercel.app/connect4" target="_blank" rel="noopener noreferrer"
                                    className="block py-2.5 px-4 hover:bg-sidePanelLink text-white">Connect 4 ↗</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className={`fixed inset-0 bg-black opacity-30 ${isOpen ? 'block' : 'hidden'} z-10`} onClick={toggleSidebar}></div>
            <div className="flex-1 flex flex-col">
                <header className="flex justify-between items-center p-4 bg-topHeader shadow-md z-30 relative">
                    <button onClick={toggleSidebar} className="p-2 rounded focus:outline-none focus:bg-navButton text-white">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                    <Link href="/" legacyBehavior>
                        <div className="text-xl font-semibold text-white">Bored? Games!</div>
                    </Link>
                    <ProfileMenu auth={auth}/>
                </header>
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
            <ChatIcon />
        </div>
    );
}
