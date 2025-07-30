/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* global FB */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from "../Helper/AxiosInstance";
import instagram1 from '../Assets/instagram1.svg';
import instaicon from '../Assets/instagramsmall.svg';
import { ReactSVG } from 'react-svg';
import {DialogTitle, Avatar, FormControlLabel, Radio, List, ListItem } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setInstaName } from '../Redux/action/NameSlice';
import { setInstagramUrl } from '../Redux/action/pageUrlsSlice';
import { setInstaLoggedIn } from '../Redux/action/loginStatusSilce';
import { t } from 'i18next';
import { Dialog, DialogContent, DialogContentText,DialogActions, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const InstagramLogin = () => {
    const [code, setCode] = useState('');
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false)
    const [instagramUrl, setInstaProfileImage] = useState('');
    const [InstagramUsername, setInstaUsername] = useState('');
    const [Instagram_follwers_count, setInstaFollowers] = useState('');
    const [instaUser, setInstaUser] = useState([]);
    const [openInstaDetails, setOpenInstaDetails] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState([]);
    const dispatch = useDispatch()
    const { instaLoggedIn } = useSelector((state) => state.loginStatus)
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    const decryptToken = (encryptedToken) => {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Error decrypting token:', error);
            return null;
        }
    };

    const encryptedToken = localStorage.getItem("qs");
    const token = decryptToken(encryptedToken);

    const fetchConnectedSocial = async () => {
        try {
            const endpoint = '/quantum-share/user/connected/socialmedia/instagram'
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            if (response.data.status === 'success' && response.data.data) {
                const { instagramUrl, InstagramUsername, Instagram_follwers_count } = response.data.data.instagram;
                setInstaProfileImage(instagramUrl);
                setInstaUsername(InstagramUsername);
                dispatch(setInstaName(InstagramUsername))
                setInstaFollowers(Instagram_follwers_count);
                dispatch(setInstagramUrl(instagramUrl));
                dispatch(setInstaLoggedIn(true))
            }
        }
        catch (error) {
            console.error(error)
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }
        }
    }

    useEffect(() => {
        fetchConnectedSocial()
    }, [token])

    const handleConnect = () => {
        setOpen(true);
    }

    const handleConnectClose = () => {
        setOpen(false);
    }

    const loadInstagramSdk = () => {
        return new Promise((resolve, reject) => {
            if (window.FB) {
                resolve();
            } else {
                window.fbAsyncInit = function () {
                    FB.init({
                        appId: '421449853704517',
                        // appId: '1397130744461736',
                        cookie: true,
                        xfbml: true,
                        version: 'v19.0'
                    });
                    resolve();
                };

                (function (d, s, id) {
                    var js,
                        fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        resolve();
                        return;
                    }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = 'https://connect.facebook.net/en_US/sdk.js';
                    fjs.parentNode.insertBefore(js, fjs);
                })(document, 'script', 'facebook-jssdk');
            }
        });
    };

    const handleInstagramLogin = () => {
        handleConnectClose();
        setLoading(true);
        loadInstagramSdk()
            .then(() => {
                FB.login(function (response) {
                    if (response.authResponse) {
                        checkLoginState();
                    } else {
                        console.log('User canceled login or didn\'t authorize the app');
                        setLoading(false);
                    }
                }, { scope: 'instagram_basic,instagram_content_publish,business_management,instagram_manage_insights' });
            })
            .catch(error => {
                console.error('Error loading Instagram SDK:', error);
                toast.error('Error loading Instagram SDK. Please try again later.');
                setLoading(false);
            })
    }

    const checkLoginState = () => {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    };

    const statusChangeCallback = async (response) => {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
            const code = response.authResponse.accessToken;
            await sendTokenToBackend(code);
        } else {
            dispatch(setInstaLoggedIn(false))
            setLoading(false);
        }
    };

    const sendTokenToBackend = async (code) => {
        try {
            const response = await axiosInstance.get(`/quantum-share/instagram/user/verify-token?code=${code}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
            });
            if (response.data.status === "success" && response.data.data) {
                setInstaUser(response.data.data);
            }
            setOpenInstaDetails(true)
        } catch (error) {
            console.error('Error sending token to backend:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if (error) {
                toast.error("Error Connecting to Instagram. Please try again later.");
            }
        }
    };

    const handleProfileChange = (event) => {
        const selectedProfile = instaUser.find(profile => profile.instaUserId === event.target.value);
        setSelectedProfile(selectedProfile);
    };

    const handleInstaDetailsClose = () => {
        setOpenInstaDetails(false);
        setLoading(true);
        setSelectedProfile([]);
    }

    const handleSubmit = async () => {
        handleInstaDetailsClose();
        
        const requestBody = {
            instaId: selectedProfile.instaId,
            instaUserId: selectedProfile.instaUserId,
            instaUsername: selectedProfile.instaUsername,
            follwersCount: selectedProfile.follwersCount,
            pictureUrl: selectedProfile.pictureUrl,
            instUserAccessToken: selectedProfile.instUserAccessToken,
        };

        try {
            const response = await axiosInstance.post(`/quantum-share/instagram/user/save/profile`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setLoading(true);
            if (response.data.status === 'success' && response.data.data) {
                const { instagramUrl, InstagramUsername, Instagram_follwers_count } = response.data.data;
                setInstaProfileImage(instagramUrl);
                setInstaUsername(InstagramUsername);
                dispatch(setInstaName(InstagramUsername))
                setInstaFollowers(Instagram_follwers_count);
                dispatch(setInstagramUrl(instagramUrl));
                dispatch(setInstaLoggedIn(true))
                toast.success("Connected to Instagram!");
            }
        } catch (error) {
            console.error('Error sending token to backend:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if (error) {
            toast.error("Error Connecting to Instagram. Please try again later."); 
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = () => {
        setOpen1(true);
    };

    const handleClose = () => {
        setOpen1(false);
    };

    const handleConfirmDisconnect = async () => {
        handleClose();
        setDisconnecting(true)
        try {
            await axiosInstance.get('/quantum-share/disconnect/instagram', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(setInstaLoggedIn(false))
            setInstaUsername('');
            setInstaFollowers('');
            setInstaProfileImage('');
            toast.success("Disconnected from Instagram!");
        } catch (error) {
            console.error('Error disconnecting from Instagram:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }
           else if(error){
            toast.error("Error disconnecting from Instagram. Please try again later.");
        } 
        } finally {
            setDisconnecting(false)
        }
    };

    const adjustFontSize = (username) => {
        if (username.length > 20) return '0.875rem';
        if (username.length > 15) return '0.962rem';
        if (username.length > 10) return '1.2rem';
        return '1.2rem';
    };

    return (
        <>
            <section className='box-soc' style={{ paddingTop: '20px' }}>
                {instaLoggedIn ? (
                    <>
                        <div className="profile-container">
                            <div className="profile-circle">
                                <img
                                    src={instagramUrl}
                                    alt="User Profile"
                                    style={{ width: '3.9rem', height: '3.9rem', borderRadius: '50%' }}
                                />
                                <div className="instagram-icon">
                                    <ReactSVG src={instaicon} />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div
                                style={{
                                    textAlign: 'center',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '200px',
                                    height: '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <p style={{ marginTop: '1px', fontSize: adjustFontSize(InstagramUsername) }}>
                                    <span style={{ color: 'gray' }}>{InstagramUsername}</span>
                                </p>
                            </div>
                            <h5>{`Followers : ${Instagram_follwers_count}`}</h5>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                            <ReactSVG src={instagram1}></ReactSVG>
                        </div>
                        <div style={{ marginTop: '15px', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                            <p style={{ marginTop: '1px', fontSize: '1.2rem', overflow: 'visible' }}>
                                <span style={{ color: 'gray' }}>Instagram</span>
                            </p>
                        </div>
                    </>
                )}
                {loading || disconnecting ? (
                    <Button variant='contained' sx={{ marginTop: instaLoggedIn ? '15px' : '30px', marginBottom: '10px', fontWeight: '600' }} disabled>
                        {loading ? 'Connecting...' : 'Disconnecting...'}
                    </Button>
                ) : (
                    !instaLoggedIn ? (
                        <Button variant='contained' sx={{ marginTop: '30px', marginBottom: '10px', fontWeight: '600' }} onClick={handleConnect}>{t('connect')}</Button>
                    ) : (
                        <Button variant='contained' sx={{ marginTop: '20px', marginBottom: '10px', fontWeight: '600' }} onClick={handleDisconnect}>{t('disconnect')}</Button>
                    )
                )}
            </section>

            <Dialog open={open} onClose={handleConnectClose}>
                <DialogTitle sx={{ m: 0, p: 2, color: '#ba343b', fontSize: '20px', textAlign: 'center' }}>
                    {t('linkInstagramProfile')}
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText sx={{ fontSize: '18px' }}>
                        {t('ensureAccountConverted')} <b>{t('instagramBusiness')}</b> or <b>{t('instagramCreator')}</b> {t('account')}
                    </DialogContentText>
                    <DialogContentText sx={{ fontSize: '18px' }}>
                        {t('verifyInstagramConnected')} <b>Facebook Page</b>.
                    </DialogContentText>
                    <br />
                    <DialogContentText sx={{ fontSize: '17px', textAlign: 'center' }}>
                        {t('knowMoreHowTo')} <Link to='/connect-socialmedia#instagram' id='info'>{t('connectFacebookPageToInstagram')}</Link><OpenInNewIcon sx={{ color: '#067acc', verticalAlign: 'middle', marginLeft: '2px', marginBottom: '5px', fontSize: 'medium' }} />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConnectClose}>Cancel</Button>
                    <Button autoFocus value={code} name="code" onClick={handleInstagramLogin}>
                        {t('continue')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openInstaDetails} onClose={handleInstaDetailsClose} fullWidth>
                <DialogTitle sx={{ color: '#b4232a', fontSize: '20px', fontWeight: 'bold' }}>Instagram Profile Details</DialogTitle>
                <DialogContent>
                    <List>
                        {Array.isArray(instaUser) && instaUser.length > 0 ? (
                            instaUser.map((profile) => (
                                <ListItem key={profile.instaUserId}>
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                value={profile.instaUserId}
                                                checked={selectedProfile?.instaUserId === profile.instaUserId}
                                                onChange={handleProfileChange}
                                            />
                                        }
                                        label={
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar src={profile.pictureUrl} alt={profile.instaUsername} style={{ marginRight: 10 }} />
                                                {profile.instaUsername}
                                            </div>
                                        }
                                        style={{ marginRight: 4 }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <DialogContentText>No profiles available.</DialogContentText>
                            </ListItem>
                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleInstaDetailsClose} color="error">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ bgcolor: '#ba343b', color: 'white', '&:hover': { bgcolor: '#9e2b31' } }}
                        disabled={selectedProfile.length === 0}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open1} onClose={handleClose} maxWidth='lg'>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black', fontSize: '17px' }}>
                        {t('confirmDisconnect')} <b>{InstagramUsername}</b> {t('instagramProfile')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('no')}</Button>
                    <Button onClick={handleConfirmDisconnect} autoFocus>{t('yes')}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isSessionExpired} aria-labelledby="alert-dialog-title" PaperProps={{ sx: { backgroundColor: '#ffffff', width: '40vw', height: '30vh' } }}>
                <DialogContent sx={{ backgroundColor: '#ffffff' }}>
                    <DialogContentText sx={{ color: 'black', display: 'flex', fontSize: '20px', alignItems: 'center' }}>
                        <IconButton>
                            <WarningIcon
                                style={{ color: 'orange', cursor: 'pointer', marginTop: '5px', fontSize: '40px', }}
                            />
                        </IconButton>
                        <div>
                            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Your session has expired</Typography>
                            <Typography sx={{ fontSize: '20px', position: 'relative', top: '5px' }}>Please log in again to continue using the app</Typography>
                        </div>
                    </DialogContentText>
                    <DialogContentText sx={{ backgroundColor: '#ffffff', fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                        <Link to="/login">
                            <Button sx={{ color: '#ba343b', fontSize: '15px', fontWeight: '600', border: '1px solid #ba343b', margin: '18px auto' }} variant="outlined">
                                Login</Button>
                        </Link>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default InstagramLogin;