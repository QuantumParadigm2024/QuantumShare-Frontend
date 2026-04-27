/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import linkedIn from '../Assets/LinkedIn1.svg';
import linkedinicon from '../Assets/linkedinsmall.svg'
import { ReactSVG } from 'react-svg';
import { DialogActions } from '@mui/material';
import axiosInstance from '../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setLinkLoggedIn } from '../Redux/action/loginStatusSilce';
import { setLinkedInProfile } from '../Redux/action/pageUrlsSlice';
import { setLinkName } from '../Redux/action/NameSlice';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const LinkedInLogin = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [linkedInProfilePic, setLinkedInProfilePic] = useState('');
    const [linkedInUserName, setLinkedInUserName] = useState('');
    const [selectedPage, setSelectedPage] = useState('');
    const [linkedInFollowersCount, setLinkedInFollowersCount] = useState('');
    const { t } = useTranslation('');
    let navigate =useNavigate()
    const dispatch = useDispatch()  
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
    
    const { linkLoggedIn } = useSelector((state) => state.loginStatus)

    const fetchConnectedSocial = async () => {
        try {
            const endpoint = 'quantum-share/user/connected/socialmedia/linkedIn'
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            if (response.data.status === 'success' && response.data.data) {
                const { linkedInUserName, linkedInProfilePic, linkedInFollowersCount } = response.data.data.linkedIn;
                setLinkedInUserName(linkedInUserName);
                dispatch(setLinkName(linkedInUserName))
                setLinkedInProfilePic(linkedInProfilePic);
                dispatch(setLinkedInProfile(linkedInProfilePic))
                setLinkedInFollowersCount(linkedInFollowersCount);
                dispatch(setLinkLoggedIn(true))
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchConnectedSocial()
    }, [token])

    const handleLinkedInLogin = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/quantum-share/linkedin/user/connect', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const { clientId, redirectUri, scope } = response.data;

            const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization` +
                `?response_type=code` +
                `&client_id=${clientId}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&scope=${encodeURIComponent(scope)}`;
            window.location.href = authorizationUrl;
        } catch (error) {
            console.error("Failed to fetch LinkedIn authorization URL:", error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }
        }
    };

    const handleDisconnect = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmDisconnect = async () => {
        handleClose();
        setDisconnecting(true);
        try {
            await axiosInstance.get('/quantum-share/disconnect/linkedin', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(setLinkLoggedIn(false))
            setLinkedInUserName('');
            setLinkedInProfilePic('');
            setSelectedPage('');
            setLinkedInFollowersCount('');
            toast.success("Disconnected from LinkedIn!");
        } catch (error) {
            console.error('Error disconnecting from LinkedIn:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if (error) {
                toast.error("Error disconnecting from LinkedIn. Please try again later.");
            }
        } finally {
            setDisconnecting(false);
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
                {linkLoggedIn ? (
                    <>
                        <div className="profile-container">
                            <div className="profile-circle">
                                <img
                                    src={linkedInProfilePic || linkedInProfilePic}
                                    alt="User Profile"
                                    style={{ width: '3.9rem', height: '3.9rem', borderRadius: '50%' }}
                                />
                                <div className="instagram-icon">
                                    <ReactSVG src={linkedinicon} />
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
                                <p style={{ marginTop: '1px', fontSize: adjustFontSize(linkedInUserName) }}>
                                    <span style={{ color: 'gray' }}>{linkedInUserName}</span>
                                </p>
                            </div>
                            <div>
                                {linkedInFollowersCount ? (
                                    <h5>{`Followers : ${linkedInFollowersCount}`}</h5>
                                ) : (
                                    <h5 style={{ visibility: 'hidden' }}>{'Followers : 0'}</h5>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                            <ReactSVG src={linkedIn}></ReactSVG>
                        </div>
                        <div style={{ marginTop: '15px', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                            <p style={{ marginTop: '1px', fontSize: '1.2rem', overflow: 'visible' }}>
                                <span style={{ color: 'gray' }}>LinkedIn</span>
                            </p>
                        </div>
                    </>
                )}
                {loading || disconnecting ? (
                    <Button variant='contained' sx={{ marginTop: linkLoggedIn ? '15px' : '30px', marginBottom: '10px', fontWeight: '600' }} disabled>
                        {loading ? 'Connecting...' : 'Disconnecting...'}
                    </Button>
                ) : (
                    !linkLoggedIn ? (
                        <Button variant='contained' sx={{ marginTop: '30px', marginBottom: '10px', fontWeight: '600' }} onClick={handleLinkedInLogin}>{t('connect')}</Button>
                    ) : (
                        <Button variant='contained' sx={{ marginTop: '20px', marginBottom: '10px', fontWeight: '600' }} onClick={handleDisconnect}>{t('disconnect')}</Button>
                    )
                )}
            </section>
            <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>
                        {t('confirmDisconnect')} <b>{linkedInUserName}</b> LinkedIn ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('cancel')}</Button>
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
};

export default LinkedInLogin;