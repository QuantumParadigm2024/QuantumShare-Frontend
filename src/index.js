import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import WebFont from 'webfontloader';
import { Provider } from "react-redux";
import store from "./Redux/store/store";
import { ImageProvider } from "./Context/ImageContext";
import './i18n.js';
import { GoogleOAuthProvider } from "@react-oauth/google";

WebFont.load({
    google: {
        families: ['Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900', 'Roboto:400,700', 'sans-serif']
    }
});

const Root = () => {

    return (
        <ImageProvider>
            <Provider store={store}>
                <GoogleOAuthProvider clientId="409442492110-3uqmgqqdd3ur012hsg1vq3thek6g9882.apps.googleusercontent.com">
                    <App />
                </GoogleOAuthProvider>
            </Provider>
        </ImageProvider>
    );
};

createRoot(document.getElementById("root")).render(<Root />);