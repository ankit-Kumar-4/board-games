import React from 'react';


interface ImageProps {
    src: string;
    alt: string;
    className?: string;
}

const ImageComponent = () => {
    return (
        <img src="https://i.imgflip.com/8wwaqv.jpg" alt="Next in Queue" className='max-w-full h-auto border-2 border-gray-300 rounded-md shadow-md' />
    );
}

export default ImageComponent;
