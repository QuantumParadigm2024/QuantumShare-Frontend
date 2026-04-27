/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../Helper/AxiosInstance';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setPinterestLoggedIn, setYouLoggedIn } from '../Redux/action/loginStatusSilce';
import { useTranslation } from 'react-i18next';
import { setPinterestProfile } from '../Redux/action/pageUrlsSlice';
import { setPinterestName } from '../Redux/action/NameSlice';
import { TailSpin } from 'react-loader-spinner';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const PinterestCallback = () => {
    const [loading, setLoading] = useState(false);
    const [pinterestProfileImage, setPinterestProfileImage] = useState('');
    const [pinterestProfileName, setPinterestProfileName] = useState('');
    const [pinterestFollowersCount, setPinterestFollowersCount] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation('');
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const dispatch = useDispatch()

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
        const query = new URLSearchParams(location.search);
        const code = query.get('code');
        if (code) {
            handleFetchProfileDetails(code);
        }
    }, [location]);

    const handleFetchProfileDetails = async (code) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/quantum-share/pinterest/user/verify-token?code=${code}`, code, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Response:', response.data);
            const { pinterestProfileImage, pinterestProfileName, pinterestFollowersCount } = response.data.data;
            setPinterestProfileImage(pinterestProfileImage);
            dispatch(setPinterestProfile(pinterestProfileImage))
            setPinterestProfileName(pinterestProfileName);
            dispatch(setPinterestName(pinterestProfileName))
            setPinterestFollowersCount(pinterestFollowersCount);
            dispatch(setPinterestLoggedIn(true))
            console.log('Pinterest Connect:', response)
            toast.success("Connected to Pinterest!");
            navigate("/social-integration");
        } catch (error) {
            console.error('Error fetching profile details:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            } else {
                toast.error('Error Connecting to Pinterest. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <TailSpin
                        height="60"
                        width="60"
                        color="#ba343b"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        visible={true}
                    />
                </div>
            ) : (
                <>

                </>
            )}
        </>
    );
};

export default PinterestCallback;