import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidenav from '../Navbar/Sidenav';
import Nav from '../Navbar/Nav';
import InstagramInfo from './InstagramInfo'
import TelegramInfo from './TelegramInfo'

const ConnectSocialMedia = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    return (
        <>
            <Nav />
            <div>
                <Sidenav />
                <div>
                    <div id='instagram'>
                        <InstagramInfo />
                    </div>
                    <br /><br /><br /><br /><br />
                    <div id='telegram'>
                        <TelegramInfo />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ConnectSocialMedia