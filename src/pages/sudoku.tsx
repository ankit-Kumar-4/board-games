import React from 'react';
// import './ImageComponent.css';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
}

const ImageComponent = () => {
    return (
        <img src="https://i.imgflip.com/8wwaym.jpg" alt="Next in Queue" className='image' />
    );
}

export default ImageComponent;
