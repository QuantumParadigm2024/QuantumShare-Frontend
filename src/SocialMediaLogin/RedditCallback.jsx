/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import { setRedditLoggedIn } from '../Redux/action/loginStatusSilce';
import { useDispatch } from 'react-redux';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const RedditCallback = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [redditProfileImage, setRedditProfileImage] = useState('');
    const [redditUsername, setRedditUsername] = useState('');
    const [subcribersCount, setSubcribersCount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
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
        let codeParam = urlParams.get('code');
        if (codeParam) {
            console.log("Original Code:", codeParam);

            handleRedditCallback(codeParam);
        } else {
            console.error('Authorization code is missing from the URL parameters.');
        }
    }, [location]);

    const handleRedditCallback = async (code) => {
        setIsLoading(true);
        try {
            console.log('Sending request with code:', code);
            const response = await axiosInstance.post(`/quantum-share/callback/reddit?state=string&code=${code}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('Token sent to backend successfully');
            if (response.data.data) {
                console.log(response);
                const responseData = response.data.data;
                const { redditUsername, redditProfileImage, subscribersCount } = responseData;
                setRedditProfileImage(redditProfileImage)
                setRedditUsername(redditUsername);
                setSubcribersCount(subscribersCount)
                setIsLoading(true);
                dispatch(setRedditLoggedIn(true));
                toast.success("Reddit connected successfully!");
                navigate('/social-integration');
            }
        } catch (error) {
            console.error('Error sending token to backend:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if (error) {
                toast.error("Error connecting to Reddit. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            {isLoading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <TailSpin color="#d3040c" height={50} width={50} />
            </div>}
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
        </div>
    );
};

export default RedditCallback;
