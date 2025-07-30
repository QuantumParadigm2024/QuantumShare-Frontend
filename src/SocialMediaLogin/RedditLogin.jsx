/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import reddit from '../Assets/redditB1.svg'
import axiosInstance from '../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import {DialogActions} from '@mui/material';
import redditsmall from '../Assets/redditsm1.svg'
import { useDispatch, useSelector } from 'react-redux';
import { setRedditLoggedIn } from '../Redux/action/loginStatusSilce';
import { setRedditName } from '../Redux/action/NameSlice';
import { setRedditProfile } from '../Redux/action/pageUrlsSlice'
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const RedditLogin = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [redditProfileImage, setRedditProfileImage] = useState('');
    const [redditUsername, setRedditUsername] = useState('');
    const [subcribersCount, setSubcribersCount] = useState('');
    const dispatch = useDispatch()
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const { redditLoggedIn } = useSelector((state) => state.loginStatus)

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
            const endpoint = '/quantum-share/user/connected/socialmedia/reddit'
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            if (response.data.status === 'success' && response.data.data) {
                const { redditUsername, redditProfileImage, subscribersCount } = response.data.data.reddit;
                setRedditUsername(redditUsername);
                dispatch(setRedditName(redditUsername))
                setRedditProfileImage(redditProfileImage)
                dispatch(setRedditProfile(redditProfileImage))
                setSubcribersCount(subscribersCount)
                dispatch(setRedditLoggedIn(true));
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
    
    const handleRedditLogin = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/quantum-share/connect/reddit', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            console.log(token);
            console.log("Reddit Login Data:", response.data);
            const { client_id: clientId, redirect_uri: redirectUri, scope } = response.data;

            if (!clientId || !redirectUri || !scope) {
                throw new Error("Missing required parameters for Reddit OAuth");
            }

            const authorizationUrl = `https://www.reddit.com/api/v1/authorize` +
                `?response_type=code` +
                `&client_id=${clientId}` +
                `&state=string` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&duration=permanent` +
                `&scope=${encodeURIComponent(scope)}`;
            console.log("Authorization URL:", authorizationUrl)
            const state = Math.random().toString(36).substring(7);
            window.location.href = authorizationUrl;
        } catch (error) {
            console.error("Failed to fetch Reddit authorization URL:", error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }
        } 
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDisconnect = () => {
        setOpen(true);
    };

    const handleConfirmDisconnect = async () => {
        handleClose();
        setDisconnecting(true)
        try {
            await axiosInstance.get('/quantum-share/disconnect/reddit', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(setRedditLoggedIn(false));
            setRedditUsername('');
            setRedditProfileImage('');
            toast.success("Disconnected from Reddit profile!");
        } catch (error) {
            console.error('Error disconnecting from reddit:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else  if(error){
                toast.error("Error disconnecting from reddit. Please try again later.");
            }
        } finally {
            setDisconnecting(false)
        }
    };

    const adjustFontSize = (username) => {
        if (!username) return '1.2rem';
        if (username.length > 20) return '0.875rem';
        if (username.length > 15) return '0.962rem';
        if (username.length > 10) return '1.2rem';
        return '1.2rem';
    };

    return (
        <>
            <section className='box-soc' style={{ paddingTop: '20px' }}>
                {redditLoggedIn ? (
                    <>
                        <div className="profile-container">
                            <div className="profile-circle">
                                <img
                                    src={redditProfileImage}
                                    alt="User Profile"
                                    style={{ width: '3.9rem', height: '3.9rem', borderRadius: '50%' }}
                                />
                                <div className="instagram-icon1">
                                    <ReactSVG src={redditsmall} />
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
                                <p style={{ marginTop: '1px', fontSize: adjustFontSize(redditUsername) }}>
                                    <span style={{ color: 'gray' }}>
                                        {redditUsername ? redditUsername : 'Reddit'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                {subcribersCount ? (
                                    <h5>{`Subcribers : ${subcribersCount}`}</h5>
                                ) : (
                                    <h5 style={{ visibility: 'hidden' }}>{'Subcribers : 0'}</h5>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                            <ReactSVG src={reddit}></ReactSVG>
                        </div>
                        <div style={{ marginTop: '15px', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                            <p style={{ marginTop: '1px', fontSize: '1.2rem', overflow: 'visible' }}>
                                <span style={{ color: 'gray' }}>Reddit</span>
                            </p>
                        </div>
                    </>

                )}

                {loading || disconnecting ? (
                    <Button variant='contained' sx={{ marginTop: redditLoggedIn ? '15px' : '30px', marginBottom: '10px', fontWeight: '600' }} disabled>
                        {loading ? 'Connecting...' : 'Disconnecting...'}
                    </Button>
                ) : (
                    !redditLoggedIn ? (
                        <Button variant='contained' sx={{ marginTop: '30px', marginBottom: '10px', fontWeight: '600' }} onClick={handleRedditLogin}>Connect</Button>
                    ) : (
                        <Button variant='contained' sx={{ marginTop: '20px', marginBottom: '10px', fontWeight: '600' }} onClick={handleDisconnect}>Disconnect</Button>
                    )
                )}
            </section>
            <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black', fontSize: '17px' }}>
                        Are you sure you want to disconnect from <b>{redditUsername}</b> Reddit Profile ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleConfirmDisconnect} autoFocus>Yes</Button>
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
};

export default RedditLogin;