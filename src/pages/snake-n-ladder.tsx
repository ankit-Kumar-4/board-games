import React, { useState, useEffect } from 'react';
import styles from '@/styles/snake-n-ladder.module.css';

const Cell = ({ step }: { step: number }) => {
    return (
        <div key={step} id={`${step}`} className={styles.cell}>{step}</div>
    );
}

function getCellNumber(i: number, j: number) {
    if (i % 2 === 0) {
        j = 9 - j;
    }
    return (i * 10) + j;
}


const Arrow = ({ fromId, toId }: { fromId: string; toId: string }) => {
    const [arrowProps, setArrowProps] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

    useEffect(() => {
        const fromElement = document.getElementById(fromId);
        const toElement = document.getElementById(toId);

        if (!fromElement || !toElement) return;

        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        setArrowProps({
            x1: fromRect.left + fromRect.width / 2,
            y1: fromRect.top + fromRect.height / 2,
            x2: toRect.left + toRect.width / 2,
            y2: toRect.top + toRect.height / 2,
        });
    }, [fromId, toId]);

    return (
        <svg className="arrow">
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="0"
                    refY="3.5"
                    orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" />
                </marker>
            </defs>
            <line
                x1={arrowProps.x1}
                y1={arrowProps.y1}
                x2={arrowProps.x2}
                y2={arrowProps.y2}
                stroke="black"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
            />
        </svg>
    );
};


const Board = () => {
    const board = [];
    for (let i = 9; i >= 0; i--) {
        for (let j = 9; j >= 0; j--) {
            board.push((
                <Cell step={getCellNumber(i, j) + 1}></Cell>
            ));
        }
    }

    return (
        // <div className={styles.container}>
        <div className={styles.board}>
            {board}
            {/* </div> */}
            <Arrow fromId="1" toId="14" />
        </div>
    )
}

export default Board;
