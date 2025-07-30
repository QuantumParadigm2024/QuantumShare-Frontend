/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';
import Nav from '../Navbar/Nav';
import Sidenav from '../Navbar/Sidenav';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import axiosInstance from '../Helper/AxiosInstance';
import { FaCirclePlay } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    textAlign: 'center',
    margin: theme.spacing(2),
}));

const PricingContainer = styled('div')(({ theme }) => ({
    margin: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const Pricing = () => {
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
    
    const navigate = useNavigate();
    const {t} = useTranslation('');
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    const handleFreeTrialClick = () => {
        if (!token) {
            toast.error('Please Log In to Proceed.');
            navigate('/login');
            return;
        }
        navigate('/dashboard');
    };

    const endpoint = `/quantum-share/user/subscription/create/payment?amount=599&packageName=standard`;

    const createOrder = async () => {
        try {
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            console.log(data);
            if (data.status === 'created' && data.code === 201) {
                return data.data;
            } else {
                throw new Error('Order creation failed');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if (error.response && error.response.status === 401) {
                toast.error('Your session has expired. Please log in again.');
                navigate('/login');
            } else {
                toast.error('Failed to create order');
            }
            return null;
        }
    };

    const handlePayment = async () => {
        if (!token) {
            toast.error('Please Log In to Proceed.');
            navigate('/login');
            return;
        }
        // navigate('/dashboard');
        const orderData = await createOrder();
        if (!orderData) {
            toast.error('Failed to create order');
            return;
        }

        const options = {
            key: orderData.payment.key,
            amount: orderData.payment.amount * 100,
            packageName: orderData.payment.packageName,
            currency: orderData.payment.currency,
            name: orderData.payment.name,
            description: 'Test Transaction',
            image: orderData.payment.image,
            order_id: orderData.payment.order_id,
            handler: function (response) {
                let params = {
                    amount: orderData.payment.amount,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    packageName: orderData.payment.packageName,
                };
                axiosInstance.post('/quantum-share/user/payment/callback/handle', params, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: params,
                }).then((res) => {
                    console.log(res);
                    console.log(response.amount);
                }).catch((err) => {
                    console.error(err);
                });
            },
            prefill: {
                name: orderData.user.name,
                email: orderData.user.email,
                contact: orderData.user.contact,
            },
            notes: {
                address: orderData.user.address,
            },
            theme: {
                color: '#3399cc',
            },
        };

        try {
            const Razorpay = window.Razorpay;
            const rzp1 = new Razorpay(options);

            rzp1.on('payment.failed', function (response) {
                alert(`Error Code: ${response.error.code}`);
                alert(`Description: ${response.error.description}`);
                alert(`Source: ${response.error.source}`);
                alert(`Step: ${response.error.step}`);
                alert(`Reason: ${response.error.reason}`);
                alert(`Order ID: ${response.error.metadata.order_id}`);
                alert(`Payment ID: ${response.error.metadata.payment_id}`);
            });
            rzp1.open();
        } catch (error) {
            console.error('Error initializing Razorpay:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true); 
                localStorage.removeItem('qs');
            }else if(error){
                alert('Error initializing payment');
            }
        }
    };

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{t('quantumSharePricing')}</title>
                    <meta name="description" content="Discover Quantum Share's transparent and flexible pricing plans, designed to meet the needs of individuals, small businesses, and enterprises. Whether you're managing a single account or multiple platforms, our pricing offers a range of features including AI-driven content generation, cross-platform posting, advanced analytics, and enhanced privacy. Choose a plan that fits your budget and start streamlining your social media management with ease." />
                    <link rel="canonical" href='/Features' />
                </Helmet>
            </HelmetProvider>
            
            <Nav />
            {token && <Sidenav />}
            <Box sx={{ marginTop: token ? '-3.2rem' : '-1rem' }}>
                <PricingContainer>
                    <SectionTitle variant="h4" align="center">
                        <h1 style={{ textAlign: 'center', color: '#ba343b', fontSize: '32px' }}>
                            {t('trySocialMedia')}
                        </h1>
                    </SectionTitle>
                    <Grid container justifyContent="center" spacing={4}>
                        <Grid item xs={12} sm={6} md={4} >
                            <StyledPaper sx={{ backgroundColor: "#fcf8f8", }}>
                                <Grid item xs={12} sm={12} md={12} >
                                    <Typography gutterBottom sx={{ textAlign: "start", fontSize: "22px", fontWeight: "bold" }}>
                                        {t('freeTrialPlan')}
                                    </Typography>
                                </Grid>
                                <Typography variant="subtitle1" gutterBottom sx={{ textAlign: "start" }}>
                                    {t('noAnnualBilling')}
                                </Typography>
                                <Typography variant="h6" gutterBottom sx={{ textAlign: "start" }}>
                                    <span style={{ fontSize: "22px", color: "#b43f4f" }}>{"\u20B9"}</span><div style={{ marginTop: "-52px", marginLeft: "12px" }}><span style={{ fontSize: "56px", color: "#b43f4f", fontWeight: "bold" }}>0</span><span style={{ color: "#a3a3a5" }}>{t('perMonth')}</span></div>
                                </Typography>
                                <Button variant="contained" onClick={handleFreeTrialClick} sx={{ width: "200px", background: "#fcf8f8", color: "#b43f4f", boxShadow: "none", border: "1px solid #b43f4f", fontSize: '16px', fontWeight: '600', marginTop: '-5px', '&:hover': { background: 'none' } }} >
                                   {t('startFreeTrial')}
                                </Button>
                                <Typography variant="body2" style={{ marginTop: '16px', marginBottom: "20px", fontSize: '14px', fontWeight: '600' }} >
                                    {t('noCreditCard')}
                                </Typography>
                                <Typography variant="subtitle1" style={{ marginTop: '8px', textAlign: "start", fontSize: '18px', fontWeight: '600' }}>
                                   {t('includes')}
                                </Typography>
                                <Grid container spacing={1} sx={{ marginTop: '5px' }} >
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }} >{t('connect5Profiles')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('planningPublishing')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('userDashboard')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('creditsPerDay5')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('languageTranslator')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CancelIcon style={{ color: 'red' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('aiAssistant')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CancelIcon style={{ color: 'red' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('advancedAnalytics')}</Typography>
                                    </Grid>
                                </Grid>
                            </StyledPaper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StyledPaper sx={{ backgroundColor: "#fcf8f8" }}>
                                <Grid item xs={12} sm={12} md={12} sx={{ backgroundColor: "#fcf8f8", display: "grid", gridTemplateColumns: "auto auto" }}>
                                    <Typography gutterBottom sx={{ textAlign: "start", fontSize: "22px", fontWeight: "bold", marginBottom: "0px" }}>
                                        {t('standardPlan')}
                                    </Typography>
                                </Grid>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "25px", textAlign: "start", marginBottom: "0px" }}>
                                    ****
                                </Typography>
                                <Typography variant="h6" gutterBottom sx={{ textAlign: "start" }}>
                                    <span style={{ fontSize: "22px", color: "#b43f4f" }}>{"\u20B9"}</span><div style={{ marginTop: "-52px", marginLeft: "12px" }}><span style={{ fontSize: "56px", color: "#b43f4f", fontWeight: "bold" }}>599</span><span style={{ color: "#a3a3a5" }}>{t('perMonth')}</span></div>
                                </Typography>
                                <Button variant="contained" onClick={handlePayment} sx={{ width: "200px", background: "#b43f4f", color: "white", boxShadow: "none", fontSize: '16px', fontWeight: '600', marginTop: '-5px', '&:hover': { bgcolor: '#9e2b31' } }}  >
                                    {t('buyNow')}
                                </Button>
                                <Typography variant="body2" style={{ marginTop: '16px', marginBottom: "20px", fontSize: '14px', fontWeight: '600' }} >
                                    {t('noCreditCard')}
                                </Typography>
                                <Typography variant="subtitle1" style={{ marginTop: '8px', textAlign: "start", fontSize: '18px', fontWeight: '600' }}>
                                    {t('includes')}
                                </Typography>
                                <Grid container spacing={1} sx={{ marginTop: '5px' }}>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('connect5Profiles')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('planningPublishing')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('userDashboard')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('unlimitedCredits')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('languageTranslator')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('aiAssistant')}</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2" sx={{ textAlign: "start", paddingLeft: "25px", fontSize: '16px', fontWeight: '600' }}>{t('advancedAnalytics')}</Typography>
                                    </Grid>
                                </Grid>
                            </StyledPaper>
                        </Grid>
                    </Grid>
                </PricingContainer>
            </Box>
            <div className="icon-container">
                <Link to='/reference-video'><FaCirclePlay className="circle-icon" /></Link>
                <div className="hover-content">{t('referencevideo')}</div>
            </div>
            <Footer />
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

const Footer = () => {
    return (
        <Box p={2} textAlign="center" bgcolor="#ba343b">
            <Typography variant="body1" color='#fff' textAlign="center">
                &copy; {new Date().getFullYear()} Quantum Share. All rights reserved | <Link to='/privacy-policy' id="privacy">Privacy Policy</Link>
            </Typography>
        </Box>
    );
}

export default Pricing;