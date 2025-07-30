/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* global FB */
import React, { useEffect, useState } from 'react';
import axiosInstance from "../Helper/AxiosInstance";
import facebook1 from '../Assets/facebook1.svg';
import fbicon from '../Assets/facebooksmall.svg';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';
import { DialogTitle, MenuItem, Select, Checkbox, FormControlLabel, List, ListItem, Avatar } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { setPageUrls } from '../Redux/action/pageUrlsSlice';
import { setFbName } from '../Redux/action/NameSlice';
import { setIsLoggedIn } from '../Redux/action/loginStatusSilce';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';
import { Link} from 'react-router-dom';

const FacebookLogin = () => {
    const [code, setCode] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [facebookUrl, setFBProfileImage] = useState('');
    const [facebookUsername, setFBUsername] = useState('');
    const [facebookNumberofpages, setNumberOfPages] = useState('');
    const [pageData, setPageData] = useState([]);
    const [selectedFBPage, setSelectedFBPage] = useState('');
    const [fbUser, setFbUser] = useState(null);
    const [fbPages, setFbPages] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const [openFBDetails, setOpenFBDetails] = useState(false);
    const { t } = useTranslation('');
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const dispatch = useDispatch()
    const { isLoggedIn } = useSelector((state) => state.loginStatus)

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
            const endpoint = '/quantum-share/user/connected/socialmedia/facebook'
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data.data)
            if (response.data.status === 'success' && response.data.data.facebook) {
                const { facebookUrl, facebookUsername, facebookNumberofpages, pages_url } = response.data.data.facebook;
                const pageDataArray = Object.entries(pages_url).map(([pageName, pageUrl]) => ({
                    pageName,
                    pageUrl,
                }));
                setPageData(pageDataArray);
                setFBProfileImage(facebookUrl);
                const pageUrls = pageDataArray.map(({ pageUrl }) => pageUrl);
                const pageNames = pageDataArray.map(({ pageName }) => pageName)
                dispatch(setFbName(pageNames))
                dispatch(setPageUrls(pageUrls));
                dispatch(setIsLoggedIn(true))
                setFBUsername(facebookUsername);
                setNumberOfPages(facebookNumberofpages);
            }
        }
        catch (error) {
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            }
        }
    }

    useEffect(() => {
        fetchConnectedSocial()
    }, [token])

    const loadFacebookSdk = () => {
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

    const handleFacebookLogin = () => {
        setLoading(true);
        loadFacebookSdk()
            .then(() => {
                FB.login(function (response) {
                    if (response.authResponse) {
                        checkLoginState();
                    } else {
                        console.log('User canceled login or didn\'t authorize the app');
                        setLoading(false);
                    }
                }, { scope: 'pages_show_list,pages_read_engagement,pages_manage_posts,business_management,read_insights' });
            })
            .catch(error => {
                console.error('Error loading Instagram SDK:', error);
                toast.error('Error loading Facebook SDK. Please try again later.');
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
            dispatch(setIsLoggedIn(false))
            setLoading(false);
        }
    };

    const sendTokenToBackend = async (code) => {
        try {
            const response = await axiosInstance.get(`/quantum-share/facebook/user/verify-token?code=${code}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
            });
            if (response.data.status === "success" && response.data.data) {
                console.log('FB Detail', response.data.data);
                setFbUser(response.data.data.fbuser);
                setFbPages(response.data.data.fbpages);
            }
            setOpenFBDetails(true)
        } catch (error) {
            console.error("Error fetching Facebook data:", error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            } else if (error) {
                toast.error("Failed to fetch Facebook data.");
            }
        }
    };

    const handleCheckboxChange = (pageId) => {
        setSelectedPages((prev) =>
            prev.includes(pageId)
                ? prev.filter((id) => id !== pageId)
                : [...prev, pageId]
        );
    };

    const handleFBDetailsClose = () => {
        setOpenFBDetails(false);
        setLoading(true);
        setSelectedPages([]);
    }

    const handleSubmit = async () => {
        handleFBDetailsClose();

        try {
            const selectedFbPages = fbPages.filter(page => selectedPages.includes(page.fbPageId));
            const requestBody = {
                fbuser: {
                    fbId: fbUser.fbId,
                    fbuserId: fbUser.fbuserId,
                    fbuserUsername: fbUser.fbuserUsername,
                    firstName: fbUser.firstName,
                    lastName: fbUser.lastName,
                    email: fbUser.email,
                    birthday: fbUser.birthday,
                    noOfFbPages: selectedFbPages.length,
                    pictureUrl: fbUser.pictureUrl,
                    userAccessToken: fbUser.userAccessToken,
                    pageDetails: selectedFbPages
                },
                fbpages: selectedFbPages.map(page => ({
                    pageTableId: 0,
                    fbPageId: page.fbPageId,
                    pageName: page.pageName,
                    pictureUrl: page.pictureUrl,
                    fbPageAceessToken: page.fbPageAceessToken,
                    instagramId: page.instagramId
                }))
            };

            const response = await axiosInstance.post(`/quantum-share/facebook/user/save/pages`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setLoading(true);
            if (response.data.status === 'success') {
                const { facebookUrl, facebookUsername, facebookNumberofpages, pages_url } = response.data.data;
                setFBProfileImage(facebookUrl);
                setFBUsername(facebookUsername);
                setNumberOfPages(facebookNumberofpages);
                const pageDataArray = Object.entries(pages_url).map(([pageName, pageUrl]) => ({
                    pageName,
                    pageUrl,
                }));
                setPageData(pageDataArray);
                const pageUrls = pageDataArray.map(({ pageUrl }) => pageUrl);
                const pageNames = pageDataArray.map(({ pageName }) => pageName)
                dispatch(setFbName(pageNames))
                dispatch(setPageUrls(pageUrls));
                dispatch(setIsLoggedIn(true))
                setFBUsername(facebookUsername);
                setNumberOfPages(facebookNumberofpages);
                toast.success("Connected to Facebook!");
            }
        } catch (error) {
            console.error('Error sending selected pages to backend:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            } if (error) {
                toast.error("Error saving pages. Please try again later.");
            }
        } finally {
            setLoading(false);
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
            await axiosInstance.get('/quantum-share/disconnect/facebook', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch(setIsLoggedIn(false))
            setFBUsername('');
            setNumberOfPages('');
            setFBProfileImage('');
            setPageData([]);
            toast.success("Disconnected from Facebook!");
        } catch (error) {
            console.error('Error disconnecting from Facebook:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            } else if (error) {
                toast.error("Error disconnecting from Facebook. Please try again later.");
            }

        } finally {
            setDisconnecting(false);
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
                {isLoggedIn ? (
                    <>
                        <div className="profile-container">
                            <div className="profile-circle">
                                <img
                                    src={facebookUrl}
                                    alt="User Profile"
                                    style={{ width: '3.9rem', height: '3.9rem', borderRadius: '50%' }}
                                />
                                <div className="instagram-icon">
                                    <ReactSVG src={fbicon} />
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
                                <p style={{ marginTop: '1px', fontSize: adjustFontSize(facebookUsername), overflow: 'visible' }}>
                                    <span style={{ color: 'gray' }}>{facebookUsername}</span>
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {facebookNumberofpages && (
                                    <h5 style={{ marginRight: '6px' }}>Number Of Pages : {facebookNumberofpages}</h5>
                                )}
                                {isLoggedIn && pageData.length > 0 && (
                                    <Select
                                        value={selectedFBPage}
                                        onChange={(e) => setSelectedPages(e.target.value)}
                                        style={{ width: '40px', height: '20px' }}
                                    >
                                        {/* <MenuItem value="" disabled>
                                        Select Page
                                    </MenuItem> */}
                                        {pageData.map((page, index) => (
                                            <MenuItem key={index} value={page.pageName}>
                                                <img src={page.pageUrl} alt={page.pageName} style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }} />
                                                {page.pageName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                            <ReactSVG src={facebook1}></ReactSVG>
                        </div>
                        <div style={{ marginTop: '15px', textAlign: 'center', overflow: 'visible', whiteSpace: 'nowrap' }}>
                            <p style={{ marginTop: '1px', fontSize: '1.2rem', overflow: 'visible' }}>
                                <span style={{ color: 'gray' }}>Facebook</span>
                            </p>
                        </div>
                    </>
                )}
                {loading || disconnecting ? (
                    <Button variant='contained' sx={{ marginTop: isLoggedIn ? '15px' : '30px', marginBottom: '10px', fontWeight: '600' }} disabled>
                        {loading ? 'Connecting...' : 'Disconnecting...'}
                    </Button>
                ) : (
                    !isLoggedIn ? (
                        <Button variant='contained' sx={{ marginTop: '30px', marginBottom: '10px', fontWeight: '600' }} onClick={handleFacebookLogin}>{t('connect')}</Button>
                    ) : (
                        <Button variant='contained' sx={{ marginTop: '20px', marginBottom: '10px', fontWeight: '600' }} onClick={handleDisconnect}>{t('disconnect')}</Button>
                    )
                )}
            </section>

            <Dialog open={openFBDetails} onClose={handleFBDetailsClose} fullWidth>
                <DialogTitle sx={{ color: '#b4232a', fontSize: '20px', fontWeight: 'bold' }}>Facebook Profile Details</DialogTitle>
                <DialogContent>
                    {fbUser && (
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                            <Avatar src={fbUser.pictureUrl} alt={fbUser.fbuserUsername} />
                            <Typography variant="h6" style={{ marginLeft: 10 }}>
                                {fbUser.fbuserUsername}
                            </Typography>
                        </div>
                    )}
                    <Typography variant="subtitle1" sx={{ color: '#b4232a', fontSize: '18px', fontWeight: 'bold' }}>Facebook Pages :</Typography>
                    {fbPages.length > 0 ? (
                        <List>
                            {fbPages.map((page) => (
                                <ListItem key={page.fbPageId}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedPages.includes(page.fbPageId)}
                                                onChange={() => handleCheckboxChange(page.fbPageId)}
                                            />
                                        }
                                        label={
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar src={page.pictureUrl} alt={page.pageName} style={{ marginRight: 10 }} />
                                                {page.pageName}
                                            </div>
                                        }
                                        style={{ marginLeft: 0 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" sx={{ color: '#b4232a', fontStyle: 'italic', marginTop: 2 }}>
                            No pages found.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFBDetailsClose} color="error">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ bgcolor: '#ba343b', color: 'white', '&:hover': { bgcolor: '#9e2b31' } }}
                        disabled={selectedPages.length === 0}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={handleClose} maxWidth='lg'>
                <DialogContent>
                    <DialogContentText sx={{ color: 'black', fontSize: '17px' }}>
                        {t('confirmDisconnect')} <b>{facebookUsername}</b> {t('facebookProfile')}
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

export default FacebookLogin;