'use cliend';

const Board: React.FC = () => {
    const cells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells.push(
                (
                    <div
                        key={i * 9 + j}
                        className={`w-8 h-8 md:w-16 md:h-16 flex items-center justify-center bg-gray-300 border border-gray-400
                            ${i % 3 === 0 ? 'border-t-2' : ''}  ${j % 3 === 0 ? 'border-l-2' : ''}`}
                    >
                        {i * 9 + j}
                    </div >
                )
            )
        }
    }

    return (
        <div className="grid grid-cols-9 ">
            {cells}
        </div>
    );
};

const Game: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center ">
            <Board />
        </div>
    );
};

export default Game;
