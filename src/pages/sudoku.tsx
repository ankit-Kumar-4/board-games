'use client';


import { useRef, useState } from 'react';

interface DropdownGridProps {
    onClose: () => void;
}

const SelectionList = ({ onClose }: DropdownGridProps) => {
    const items = Array.from({ length: 9 }, (_, index) => index + 1);

    return (
        <div className="relative inline-block text-left">
            <div className="origin-top-right absolute right-0 mt-2 w-32 md:w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="grid grid-cols-3 gap-1 p-2">
                    {items.map((item) => (
                        <button
                            key={item}
                            className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center border border-gray-300 bg-gray-100 hover:bg-gray-200"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const Board: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const gridRef = useRef<HTMLDivElement>(null);

    const handleCellClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        console.log(viewportHeight, viewportWidth)
        const ddlSize = 40;
        console.log(event.clientX, event.clientY);

        let dropdownTop = Math.max(event.clientY, 190) + ddlSize;
        let dropdownLeft = Math.max(event.clientX, 100);
        dropdownTop = Math.min(dropdownTop, 600);


        setDropdownPosition({ top: dropdownTop, left: dropdownLeft });
        setIsOpen(true);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };
    const cells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells.push(
                (
                    <div
                        key={i * 9 + j}
                        className={`w-8 h-8 md:w-16 md:h-16 flex items-center justify-center bg-gray-300 border border-gray-400
                            ${i % 3 === 0 ? 'border-t-2' : ''}  ${j % 3 === 0 ? 'border-l-2' : ''}`}
                        onClick={handleCellClick}
                    >
                        {i * 9 + j}
                    </div >
                )
            )
        }
    }

    return (
        <div ref={gridRef} className='relative'>
            <div className="grid grid-cols-9 ">
                {cells}
            </div>
            {isOpen && (
                <div
                    style={{ top: dropdownPosition.top - 4 * 64, left: dropdownPosition.left }}
                    className="absolute"
                >
                    <SelectionList onClose={closeDropdown} />
                </div>
            )}
        </div>
    );
};

const Game: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center ">
            <div>Work in progress...</div>
            <Board />
        </div>
    );
};

export default Game;
