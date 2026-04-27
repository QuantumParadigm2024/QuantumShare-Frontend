import React, { createContext, useState } from 'react';

const ImageContext = createContext();

const ImageProvider = ({ children }) => {

    const [image1, setImage1] = useState(null)

    return (
        <ImageContext.Provider value={{ image1, setImage1, }}>
            {children}
        </ImageContext.Provider>
    )

}

export { ImageContext, ImageProvider };