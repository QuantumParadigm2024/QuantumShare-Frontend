import React, { createContext, useState } from 'react';

const PostImageContext = createContext();

const ImageProvider1 = ({ children }) => {
    const [postedImage, setPostedImage] = useState(null);
    return (
        <PostImageContext.Provider value={{ postedImage, setPostedImage }}>
            {children}
        </PostImageContext.Provider>
    );
}

export { PostImageContext, ImageProvider1 };
