import React from 'react';
// import './ImageComponent.css';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
}

const ImageComponent = () => {
    return (
        <img src="https://i1.sndcdn.com/artworks-dcZZznwvCIjxzVdh-Ia2kPw-t500x500.jpg" alt="Next in Queue" className='image' />
    );
}

export default ImageComponent;
