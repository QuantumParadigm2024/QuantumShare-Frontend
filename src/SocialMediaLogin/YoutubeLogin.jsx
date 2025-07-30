/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axiosInstance from "../Helper/AxiosInstance";
import youtube1 from '../Assets/youtube1.svg';
import yticon from '../Assets/youtubesmall.svg';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';
import { DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setYoutubeProfile } from '../Redux/action/pageUrlsSlice';
import { setYouLoggedIn } from '../Redux/action/loginStatusSilce';
import { setYouName } from '../Redux/action/NameSlice';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const YoutubeLogin = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [youtubeChannelName, setYoutubeChannelName] = useState('');
    const [youtubeSubscriberCount, setYoutubeSubscriberCount] = useState('');
    let navigate=useNavigate()
    const {t} = useTranslation('');
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const dispatch = useDispatch()
    const { YouLoggedIn } = useSelector((state) => state.loginStatus)

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
            const endpoint = '/quantum-share/user/connected/socialmedia/youtube'
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.status === 'success' && response.data.data) {
                const { youtubeUrl, youtubeChannelName, youtubeSubscriberCount } = response.data.data.youtube;
                console.log(youtubeUrl);
                setYoutubeUrl(youtubeUrl);
                dispatch(setYoutubeProfile(youtubeUrl))
                setYoutubeChannelName(youtubeChannelName);
                dispatch(setYouName(youtubeChannelName))
                setYoutubeSubscriberCount(youtubeSubscriberCount);
                console.log('Youtube Fetch:', response)
                dispatch(setYouLoggedIn(true))
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

    const handleYoutubeLogin = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/quantum-share/youtube/user/connect', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const oauthUrl = response.data.data;
            console.log(oauthUrl);
            window.location.href = oauthUrl;
        } catch (error) {
            console.error('Error', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if(error){
                toast.error('Error loading Youtube Login Page. Please try again later.');
            }
        }
    }

    const handleDisconnect = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDisconnect = async () => {
        handleClose();
        setDisconnecting(true)
        try {
            await axiosInstance.get('/quantum-share/disconnect/youtube', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(setYouLoggedIn(false))
            setYoutubeChannelName('');
            setYoutubeUrl('');
            setYoutubeSubscriberCount('');
            toast.success("Disconnected from YouTube!");
        } catch (error) {
            console.error('Error disconnecting from Youtube:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if (error) {
                toast.error("Error disconnecting from Youtube. Please try again later.");
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
                {YouLoggedIn ? (
                    <>
                        <div className="profile-container">
                            <div className="profile-circle">
                                <img
                                    src={youtubeUrl}
                                    alt="User Profile"
                                    style={{ width: '3.9rem', height: '3.9rem', borderRadius: '50%' }}
                                />
                                <div className="instagram-icon">
                                    <ReactSVG src={yticon} />
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
                                <p style={{ marginTop: '1px', fontSize: adjustFontSize(youtubeChannelName) }}>
                                    <span style={{ color: 'gray' }}>{youtubeChannelName}</span>
                                </p>
                            </div>
                            <h5>{`Subscribers : ${youtubeSubscriberCount}`}</h5>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                            <ReactSVG src={youtube1}></ReactSVG>
                        </div>
                        <div style={{ marginTop: '15px', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                            <p style={{ marginTop: '1px', fontSize: '1.2rem', overflow: 'visible' }}>
                                <span style={{ color: 'gray' }}>YouTube</span>
                            </p>
                        </div>
                    </>
                )}
                {loading || disconnecting ? (
                    <Button variant='contained' sx={{ marginTop: YouLoggedIn ? '15px' : '30px', marginBottom: '10px', fontWeight: '600' }} disabled>
                        {loading ? 'Connecting...' : 'Disconnecting...'}
                    </Button>
                ) : (
                    !YouLoggedIn ? (
                        <Button variant='contained' sx={{ marginTop: '30px', marginBottom: '10px', fontWeight: '600' }} onClick={handleYoutubeLogin} disabled>{t('connect')}</Button>
                    ) : (
                        <Button variant='contained' sx={{ marginTop: '20px', marginBottom: '10px', fontWeight: '600' }} onClick={handleDisconnect}>{t('disconnect')}</Button>
                    )
                )}
            </section>

            <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black', fontSize: '17px' }}>
                       {t('confirmDisconnect')} <b>{youtubeChannelName}</b> Youtube Channel ?
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

export default YoutubeLogin