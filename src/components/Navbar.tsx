import Link from 'next/link';
import styles from './Navbar.module.css'; // We'll create this CSS file next

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">Games</Link>
            </div>
            <ul className={styles.navLinks}>
                <li>
                    <Link href="/">Tic-tac-toe</Link>
                </li>
                <li>
                    <Link href="/wordle">Wordle</Link>
                </li>
                <li>
                    <Link href="/snake-n-ladder">Snake & Ladders</Link>
                </li>
                <li>
                    <Link href="/2048">2048</Link>
                </li>
                <li>
                    <Link href="/sudoku">Sudoku</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
