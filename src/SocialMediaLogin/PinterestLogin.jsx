/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import axiosInstance from "../Helper/AxiosInstance";
import pinterest1 from '../Assets/pinterest1.svg';
import pinteresticon from '../Assets/pinterestsmall.png';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';
import { Dialog, DialogActions, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import { setPinterestLoggedIn } from '../Redux/action/loginStatusSilce';
import { useDispatch, useSelector } from 'react-redux';
import { setPinterestName } from '../Redux/action/NameSlice';
import { setPinterestProfile } from '../Redux/action/pageUrlsSlice';
import { setPinterestBoards } from '../Redux/action/pinterestBoardsSlice';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const PinterestLogin = () => {
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [pinterestProfileImage, setPinterestProfileImage] = useState('');
    const [pinterestProfileName, setPinterestProfileName] = useState('');
    const [pinterestFollowersCount, setPinterestFollowersCount] = useState('');
    const [pinterestBoardDetails, setPinterestBoardDetails] = useState([]);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const { t } = useTranslation('');
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { pinterestLoggedIn } = useSelector((state) => state.loginStatus)

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
            const endpoint = '/quantum-share/user/connected/socialmedia/pinterest'
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.status === 'success' && response.data.data) {
                const { pinterestProfileImage, pinterestProfileName, pinterestFollowersCount, pinterestBoardDetails } = response.data.data.pinterest;
                const boards = JSON.parse(pinterestBoardDetails);
                const boardNames = boards.map(board => board.boardName);
                console.log(boardNames); 
                setPinterestBoardDetails(boardNames);
                dispatch(setPinterestBoards(boardNames)); 
                setPinterestProfileImage(pinterestProfileImage);
                dispatch(setPinterestProfile(pinterestProfileImage))
                setPinterestProfileName(pinterestProfileName);
                dispatch(setPinterestName(pinterestProfileName))
                setPinterestFollowersCount(pinterestFollowersCount);
                dispatch(setPinterestLoggedIn(true))
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

    const handlePinterestLogin = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/quantum-share/pinterest/user/connect', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const oauthUrl = response.data.data;
            console.log(oauthUrl);
            window.location.href = oauthUrl;
        } catch (error) {
            console.error('Error', error);
            if (error) {
                toast.error('Error loading Pinterest Login Page. Please try again later.');
                setLoading(false);
            } else if (error.response.data.code === 121) {
                localStorage.removeItem('qs')
                navigate('/session')
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
            await axiosInstance.get('/quantum-share/disconnect/pinterest', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(setPinterestLoggedIn(false))
            setPinterestName('');
            setPinterestProfile('');
            setPinterestFollowersCount('');
            toast.success("Disconnected from Pinterest!");
        } catch (error) {
            console.error('Error disconnecting from Pinterest:', error);
            if (error) {
                toast.error("Error disconnecting from Pinterest. Please try again later.");
            } else if (error.response.data.code === 121) {
                localStorage.removeItem('qs')
                navigate('/session')
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
                {pinterestLoggedIn ? (
                    <>
                        <div className="profile-container">
                            <div className="profile-circle">
                                <img
                                    src={pinterestProfileImage}
                                    alt="User Profile"
                                    style={{ width: '3.9rem', height: '3.9rem', borderRadius: '50%' }}
                                />
                                <div style={{ position: 'relative', bottom: '1.85rem', right: '-2rem', width: '2.5rem', height: '2.5rem' }}>
                                    <img src={pinteresticon} />
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
                                <p style={{ marginTop: '1px', fontSize: adjustFontSize(pinterestProfileName) }}>
                                    <span style={{ color: 'gray' }}>{pinterestProfileName}</span>
                                </p>
                            </div>
                            <h5>{`Followers : ${pinterestFollowersCount}`}</h5>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                            <ReactSVG src={pinterest1}></ReactSVG>
                        </div>
                        <div style={{ marginTop: '15px', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                            <p style={{ marginTop: '1px', fontSize: '1.2rem', overflow: 'visible' }}>
                                <span style={{ color: 'gray' }}>Pinterest</span>
                            </p>
                        </div>
                    </>
                )}
                {loading || disconnecting ? (
                    <Button variant='contained' sx={{ marginTop: pinterestLoggedIn ? '15px' : '30px', marginBottom: '10px', fontWeight: '600' }} disabled>
                        {loading ? 'Connecting...' : 'Disconnecting...'}
                    </Button>
                ) : (
                    !pinterestLoggedIn ? (
                        <Button variant='contained' sx={{ marginTop: '30px', marginBottom: '10px', fontWeight: '600' }} onClick={handlePinterestLogin} disabled>{t('connect')}</Button>
                    ) : (
                        <Button variant='contained' sx={{ marginTop: '20px', marginBottom: '10px', fontWeight: '600' }} onClick={handleDisconnect}>{t('disconnect')}</Button>
                    )
                )}
            </section>
            <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black', fontSize: '17px' }}>
                        {t('confirmDisconnect')} <b>{pinterestProfileName}</b> Pinterest Profile ?
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

export default PinterestLogin