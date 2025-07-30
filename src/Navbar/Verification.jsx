/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../Helper/AxiosInstance';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DoneIcon from '@mui/icons-material/Done';
import QS from "../Assets/QS.webp";
import emg1 from '../Assets/msg.webp';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

function Verification() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [signupMessage, setSignupMessage] = useState("A verification link has been sent to your email. Please verify to access login.");
    const {t} =useTranslation('');
    const navigate = useNavigate()

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        if (token) {
            handleVerification(token);
        }
    }, [location.search]);

    const handleVerification = async (token) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/quantum-share/user/verify?token=${token}`);
            setVerificationResult(response.data);
            setSignupMessage(null);
        } catch (error) {
            if(error.response.data.code === 121){
                localStorage.removeItem('qs');
                navigate('/session');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6} sx={{ background: '#f5f5f5', display: { xs: 'none', md: 'flex' } }}>
                        <div>
                            <img src={emg1} alt="Logo" style={{ height: '99vh', width: '100%' }} />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} sx={{ background: '#ffffff', height: '100vh' }}>
                        <img src={QS} alt="Logo" style={{ height: 40, width: 'auto', margin: '10px' }} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '80px' }}>
                            <div style={{ textAlign: 'center', width: '500px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ba343b', color: '#ffffff', marginLeft: '45%', marginBottom: '40px' }}>
                                    <DoneIcon style={{ fontSize: '60px', padding: '3px' }} />
                                </div>
                                <h2>{verificationResult ? "Email Verified!" : "Signup Successful! Verify Your Email"}</h2>
                                {verificationResult ? (
                                    <div>
                                        <p style={{ marginTop: '12px', color: 'gray', fontSize: '18px' }}>Your email <b style={{ color: '#ba343b' }}>{verificationResult.data.user.email}</b> {t('successfullyUpdated')}</p>
                                        <Link to='/login'><button style={{ backgroundColor: '#ba343b', color: '#fff', padding: '10px 20px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: '600', margin: '30px' }}>{t('login')}</button></Link>
                                    </div>
                                ) : (
                                    <p style={{ marginTop: '12px', color: 'gray', fontSize: '18px' }}>{signupMessage}</p>
                                )}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default Verification;