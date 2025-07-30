/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
import QS from '../Assets/QS.webp';
import { setLinkLoggedIn } from '../Redux/action/loginStatusSilce';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const LinkedInCallback = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [code, setCode] = useState('');
    const [pages, setPages] = useState([]);
    const [linkedInUserName, setLinkedInUserName] = useState('');
    const [linkedInProfilePic, setLinkedInProfilePic] = useState('');
    const [linkedInProfile, setLinkedInProfile] = useState('');
    const [linkedInFollowersCount, setLinkedInFollowersCount] = useState('');
    const [activeSelection, setActiveSelection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageConnecting, setIsPageConnecting] = useState(false);
    const [isSubmitVisible, setIsSubmitVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUrn, setSelectedUrn] = useState('');
    const [selectedAccessToken, setSelectedAccessToken] = useState('');
    const navigate = useNavigate();
    const {t} = useTranslation('');
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

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const codeParam = urlParams.get('code');
        if (codeParam) {
            setCode(codeParam);
            handleLinkedInCallback(codeParam);
        } else {
            console.error('Authorization code is missing from the URL parameters.');
        }
    }, [location]);

    const handleLinkedInCallback = async (code) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.post(`/quantum-share/linkedin/callback/success?code=${code}`, { code }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const responseData = response.data;
            if (responseData && responseData.data) {
                const { linkedInPages, linkedInProfile } = responseData.data;
                if (linkedInProfile) {
                    setLinkedInUserName(linkedInProfile.name);
                    setLinkedInProfilePic(linkedInProfile.profile_image);
                    setLinkedInProfile({
                        urn: linkedInProfile.urn,
                        accessToken: linkedInProfile.accessToken,
                    });
                }
                if (linkedInPages && Array.isArray(linkedInPages)) {
                    setPages(linkedInPages);
                }
            } else {
                console.error('Invalid response from the backend');
            }
        } catch (error) {
            console.error('Error fetching data from backend:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if(error){
                toast.error("Error connecting to LinkedIn. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelection = async (type, data) => {
        try {
            setIsPageConnecting(true);
            const response = await axiosInstance.post(`/quantum-share/linkedIn/selected/page?type=${type}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                const { linkedInUserName, linkedInProfilePic, linkedInFollowersCount } = response.data.data;
                setLinkedInUserName(linkedInUserName);
                setLinkedInProfilePic(linkedInProfilePic);
                setLinkedInFollowersCount(linkedInFollowersCount);
                dispatch(setLinkLoggedIn(true));
                navigate("/social-integration");
                toast.success(`Connected to LinkedIn ${type === 'profile' ? 'Profile' : 'Page'}!`);
            } else {
                toast.error(`Failed to connect to LinkedIn ${type === 'profile' ? 'Profile' : 'Page'}`);
            }
        } catch (error) {
            console.error('Error saving the selected page/profile:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if (error) {
            toast.error("Error saving the selected page/profile. Please try again later.");
            }
        } finally {
            setIsPageConnecting(false);
        }
    };

    const handleProfileClick = () => {
        setActiveSelection('profile');
        setIsSubmitVisible(true);
        setSelectedUrn(selectedUrn); 
        setSelectedAccessToken(selectedAccessToken);
    };

    const handlePageSelect = (page) => {
        setActiveSelection(page.urn);
        setIsSubmitVisible(true);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        if (activeSelection === 'profile') {
            handleSelection('profile', {
                urn: linkedInProfile.urn,
                name: linkedInUserName,
                profile_image: linkedInProfilePic,
                accessToken: linkedInProfile.accessToken,
            }).finally(() => setIsSubmitting(false));
        } else {
            const selectedPage = pages.find(page => page.urn === activeSelection);
            handleSelection('page', {
                urn: selectedPage.urn,
                name: selectedPage.name,
                profile_image: selectedPage.profile_image,
                accessToken: selectedPage.accessToken
            }).finally(() => setIsSubmitting(false));
        }
    };

    return (
        <>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <TailSpin color="#d3040c" height={50} width={50} />
                </div>
            ) : (
                <div id='callbacks'>
                    <img src={QS} alt="Logo" style={{ height: 30, width: 'auto', marginLeft: '12rem' }} />
                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '20px', fontWeight: 'bold' }}>
                        {t('addLinkedInProfileOrPage')}
                    </div>
                    <div style={{ color: '#d3040c', marginTop: '1rem', fontWeight: 'bold' }}>
                        {t('addLinkedInProfile')}
                    </div>
                    <div onClick={handleProfileClick} style={{
                        marginTop: '1rem', display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer'
                    }}>
                        <input type="radio" checked={activeSelection === 'profile'} onChange={() => setActiveSelection('profile')} style={{ marginRight: '10px' }} />
                        {linkedInUserName && linkedInProfilePic && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={linkedInProfilePic} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>{linkedInUserName}</h4>
                                </div>
                            </div>
                        )}
                    </div>
                    {Array.isArray(pages) && pages.length > 0 && (
                        <>
                            <div style={{ color: '#d3040c', marginTop: '2rem', fontWeight: 'bold' }}>
                                {t('addPageAssociatedWithAccount')}
                            </div>
                            <ul style={{ paddingLeft: '0', listStyleType: 'none', marginTop: '1rem' }}>
                                {pages.map((page) => (
                                    <li key={page.urn} style={{
                                        padding: '10px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '10px', display: 'flex', alignItems: 'center', cursor: 'pointer'
                                    }} onClick={() => handlePageSelect(page)}>
                                        <input type="radio" checked={activeSelection === page.urn} onChange={() => setActiveSelection(page.urn)} style={{ marginRight: '10px' }} />
                                        <img src={page.profile_image || 'https://via.placeholder.com/50'} alt={page.name} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                        <div style={{ marginLeft: '10px' }}>
                                            <h4 style={{ margin: '0' }}>{page.name}</h4>
                                            <span style={{ fontSize: '14px' }}>{t('linkedInCompanyPage')}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {isSubmitVisible && (
                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button onClick={handleSubmit} style={{
                                padding: '10px 20px', backgroundColor: '#d3040c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
                            }}>
                                {isSubmitting ? (
                                    <TailSpin color="#ffffff" height={20} width={20} />
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
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

export default LinkedInCallback;