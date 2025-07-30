/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import Nav from '../Navbar/Nav';
import Sidenav from '../Navbar/Sidenav';
import FacebookLogin from './FacebookLogin';
import InstagramLogin from './InstagramLogin';
import TelegramLogin from './TelegramLogin';
import YoutubeLogin from './YoutubeLogin';
import TwitterLogin from './TwitterLogin';
import LinkedInLogin from './LinkedInLogin';
import { Link } from 'react-router-dom';
import { FaCirclePlay } from "react-icons/fa6";
import RedditLogin from './RedditLogin';
import PinterestLogin from './PinterestLogin';
import { useTranslation } from 'react-i18next';
import { FaCrown } from "react-icons/fa";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FetchUser } from '../Redux/FetchUser';

const SocialMediaLogin = () => {
    const { t } = useTranslation('');
    const { remainingDays, trail, subscription } = useSelector((state) => state.data);
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Calling FetchUser...");
        FetchUser(dispatch, setShowPopup);
    }, [dispatch]);

    useEffect(() => {
        console.log("Trial:", trail, "Subscription:", subscription, "Remaining Days:", remainingDays);
        if (trail === false && subscription === false && remainingDays === 0) {
            setShowPopup(true);
        }
    }, [trail, subscription, remainingDays]);

    return (
        <>
            <Nav />
            <Dialog
                open={showPopup}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        setShowPopup(false);
                    }
                }}
                disableEscapeKeyDown
                BackdropProps={{
                    onClick: (e) => e.stopPropagation()
                }}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '400px',
                        padding: '20px',
                        borderRadius: '20px',
                        background: '#f8f9ff',
                        border: '3px solid #a3c0ff',
                        boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.15)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'visible'
                    },
                }}
            >
                <DialogTitle sx={{ color: '#b4232a', fontSize: '22px', fontWeight: 'bold' }}>
                    Subscription Expired!
                </DialogTitle>
                <DialogContent>
                    Your free trial has expired. Please subscribe to the Standard Plan to continue using the service.
                </DialogContent>
                <DialogActions sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Link to='/pricing' style={{ textDecoration: 'none', width: '50%' }}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                color: '#ba343b',
                                background: "#fcf8f8",
                                border: '1px solid #ba343b',
                                borderRadius: '30px',
                                fontWeight: 'bold',
                                '&:hover': { background: 'none' }
                            }}
                        >
                            Subscribe Now
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
            <div style={{ display: 'flex' }}>
                <Sidenav />
                <Box sx={{ flexGrow: 1, marginLeft: '1rem' }}>
                    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                        <h1 style={{ textAlign: 'center', color: '#ba343b', fontSize: '1.7rem' }}>
                            {t('connectSocialNetwork')}
                        </h1>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className='container-soc'>
                                <div className='box-container-soc' style={{ display: 'flex', justifyContent: 'space-around', margin: '25px auto', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
                                    <FacebookLogin />
                                    <InstagramLogin />
                                    <LinkedInLogin />
                                    {/* <YoutubeLogin /> */}
                                    <RedditLogin />
                                    {/* <PinterestLogin /> */}
                                    <TelegramLogin />
                                </div>
                            </div>
                        </div>
                        <h1 style={{ textAlign: 'center', color: '#ba343b', fontSize: '24px', margin: '10px auto' }}>
                            {t('upcomingMediaPlatforms')}
                        </h1>
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', marginTop: '-2rem' }}>
                            <div className='container-soc' style={{ maxWidth: '1200px', width: '100%' }}>
                                <div className='box-container-soc' style={{ display: 'flex', justifyContent: 'space-evenly', margin: '25px auto', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <div style={{ position: 'relative', textAlign: 'center' }}>
                                        <YoutubeLogin />
                                        <FaCrown style={{ position: 'absolute', top: '5px', right: '8px', color: '#ffbf00', fontSize: '1.5rem' }} />
                                    </div>
                                    <div style={{ position: 'relative', textAlign: 'center' }}>
                                        <TwitterLogin />
                                        <FaCrown style={{ position: 'absolute', top: '5px', right: '8px', color: '#ffbf00', fontSize: '1.5rem' }} />
                                    </div>
                                    <div style={{ position: 'relative', textAlign: 'center' }}>
                                        <PinterestLogin />
                                        <FaCrown style={{ position: 'absolute', top: '5px', right: '8px', color: '#ffbf00', fontSize: '1.5rem' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </Box>
            </div>
            <div className="icon-container">
                <Link to='/reference-video'><FaCirclePlay className="circle-icon" /></Link>
                <div className="hover-content">reference video</div>
            </div>
            <Footer />
        </>
    );
}

const Footer = () => {
    return (
        <Box p={2} textAlign="center" bgcolor="##333333" marginTop={9.3}>
            <Typography variant="body1" color='#fff' textAlign="center">
                &copy; {new Date().getFullYear()} Quantum Share. All rights reserved | <Link to='/privacy-policy' id="privacy">Privacy Policy</Link>
            </Typography>
        </Box>
    );
}

export default SocialMediaLogin;