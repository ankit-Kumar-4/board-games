import { useState, useEffect } from "react";
import { useHotkeys } from 'react-hotkeys-hook';

const ImageComponent = () => {
    const [count, setCount] = useState(0)
    useHotkeys('up', () => setCount(count + 1), [count])
    useHotkeys('down', () => setCount(count + 1), [count])
    useHotkeys('left', () => setCount(count + 1), [count])
    useHotkeys('right', () => setCount(count + 1), [count])

    return (
        <p>
            Pressed {count} times.
        </p>
    )
}

export default ImageComponent;
