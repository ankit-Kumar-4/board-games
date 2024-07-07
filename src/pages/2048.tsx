import React from 'react';
// import './ImageComponent.css';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
}

const ImageComponent = () => {
    return (
        <img src="https://static.wikia.nocookie.net/the-uncanny-incredible/images/8/8e/Nintenmouse%27s_remake_of_Phase_9.png" alt="Next in Queue" className='image' />
    );
}

export default ImageComponent;
