/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import TryIcon from '@mui/icons-material/Try';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidenav from '../Navbar/Sidenav';
import Nav from '../Navbar/Nav';
import { FaCirclePlay } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FetchUser } from '../Redux/FetchUser';
import QI from '../Sidebar/QI';
import Post from './Post';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogContentText, Typography, IconButton, DialogTitle, DialogActions, } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import axiosInstance from '../Helper/AxiosInstance';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const Dashboard = () => {
    const { remainingDays, remainingCredits, trail, subscription } = useSelector((state) => state.data);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [AIopen, setAIopen] = useState(false)
    const [Postopen, setpostopen] = useState(false)
    const { t } = useTranslation();
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const [combinedData, setCombinedData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

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

    const handleSessionExpired = () => {
        console.log('Session expired, opening dialog');
        setIsSessionExpired(true);
    };

    useEffect(() => {
        console.log("Calling FetchUser...");
        FetchUser(dispatch, handleSessionExpired, setShowPopup);
    }, [dispatch]);

    useEffect(() => {
        console.log("Trial:", trail, "Subscription:", subscription, "Remaining Days:", remainingDays);
        if (trail === false && subscription === false && remainingDays === 0) {
            setShowPopup(true);
        }
    }, [trail, subscription, remainingDays]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/quantum-share/socialmedia/get/graph/data', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.status === "success") {
                    const maxData = response.data.data.max;
                    const dailyData = response.data.data.daily;
                    const allDates = new Set([...Object.keys(maxData), ...Object.keys(dailyData)]);
                    const combinedChartData = Array.from(allDates).map(date => ({
                        date,
                        maxPosts: maxData[date],
                        dailyPosts: dailyData[date] || 0
                    }));
                    combinedChartData.sort((a, b) => new Date(a.date) - new Date(b.date));
                    setCombinedData(combinedChartData);
                }
            } catch (error) {
                console.error("Error fetching data:", error.response ? error.response.data : error.message);
            }
        };
        fetchData();
    }, []);

    const filteredMaxData = combinedData.filter(data => data.maxPosts > 0);
    const handleAIComponent = () => {
        setAIopen(!AIopen)
    }

    const handleAIClose = () => {
        setAIopen(false)
    }

    const handleSocialClick = () => {
        navigate('/social-integration')
    }

    const handleAnalyticsClick = () => {
        navigate('/analytics')
    }

    const handlePost = () => {
        setpostopen(!Postopen)
    }

    const handleClosePost = () => {
        setpostopen(false)
    }

    return (
        <>
            <div>
                <Nav />
                <Dialog
                    open={showPopup}
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick') {
                            setShowPopup(false);
                        }
                    }}
                    disableEscapeKeyDown
                    BackdropProps={{
                        onClick: (e) => e.stopPropagation()
                    }}
                    sx={{
                        '& .MuiDialog-paper': {
                            width: '400px',
                            padding: '20px',
                            borderRadius: '20px',
                            background: '#f8f9ff',
                            border: '3px solid #a3c0ff',
                            boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.15)',
                            textAlign: 'center',
                            position: 'relative', 
                            overflow: 'visible'
                        },
                    }}
                >
                    <DialogTitle sx={{ color: '#b4232a', fontSize: '22px', fontWeight: 'bold' }}>
                        Subscription Expired!
                    </DialogTitle>
                    <DialogContent>
                        Your free trial has expired. Please subscribe to the Standard Plan to continue using the service.
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Link to='/pricing' style={{ textDecoration: 'none', width: '50%' }}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    color: '#ba343b',
                                    background: "#fcf8f8",
                                    border: '1px solid #ba343b',
                                    borderRadius: '30px',
                                    fontWeight: 'bold',
                                    '&:hover': { background: 'none' }
                                }}
                            >
                                Subscribe Now
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>

                <div style={{ display: 'flex' }}>
                    <Sidenav />
                    <Box sx={{ flexGrow: 1, marginLeft: '2rem' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }}>
                                    <h2 style={{ padding: '10px', color: 'grey', marginLeft: '1rem' }}>{t('welcome')}</h2>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'white', padding: '10px' }}>
                                        {remainingDays !== null && (
                                            <Button
                                                sx={{
                                                    mr: 1,
                                                    color: '#ba343b',
                                                    fontSize: '14px',
                                                    border: '1px solid #ba343b'
                                                }}
                                                variant="outlined"
                                            >
                                                {t('trailExpires')} {remainingDays} {t('days')}
                                            </Button>
                                        )}
                                        {remainingCredits !== null && (
                                            <Button
                                                sx={{
                                                    mr: 1,
                                                    bgcolor: '#ba343b',
                                                    fontSize: '14px',
                                                    '&:hover': { bgcolor: '#9e2b31' },
                                                }}
                                                variant="contained"
                                            >
                                                {remainingCredits} {t('creditsLeft')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <Card sx={{ width: 250, height: 100, margin: 1, cursor: 'pointer' }} onClick={handleAIComponent}>
                                        <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <Typography sx={{ fontSize: 18, paddingTop: '20px' }} gutterBottom>
                                                {t('quantum_ai')}
                                            </Typography>
                                            <IconButton >
                                                <AutoFixHighIcon sx={{ color: 'white', bgcolor: '#ba343b', width: '50px', height: '50px', padding: '7px', borderRadius: '50%' }} />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                    {AIopen && <QI onAiClose={handleAIClose} />}
                                    <Card sx={{ width: 250, height: 100, margin: 1, cursor: 'pointer' }} onClick={handleSocialClick}>
                                        <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <Typography sx={{ fontSize: 18, paddingTop: '20px' }} gutterBottom>
                                                {t('connect_social')}
                                            </Typography>
                                            <IconButton >
                                                <TryIcon sx={{ color: 'white', bgcolor: '#ba343b', width: '50px', height: '50px', padding: '7px', borderRadius: '50%' }} />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ width: 250, height: 100, margin: 1, cursor: 'pointer' }} onClick={handlePost}>
                                        <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <Typography sx={{ fontSize: 18, paddingTop: '20px' }} gutterBottom>
                                                {t('social_media_post')}
                                            </Typography>
                                            <IconButton >
                                                <PhotoFilterIcon sx={{ color: 'white', bgcolor: '#ba343b', width: '50px', height: '50px', padding: '7px', borderRadius: '50%' }} />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                    {Postopen && <Post onClose={handleClosePost} />}
                                    <Card sx={{ width: 250, height: 100, margin: 1, cursor: 'pointer' }} onClick={handleAnalyticsClick}>
                                        <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <Typography sx={{ fontSize: 18, paddingTop: '20px' }} gutterBottom>
                                                {t('analytics')}
                                            </Typography>
                                            <IconButton >
                                                <AutoGraphIcon sx={{ color: 'white', bgcolor: '#ba343b', width: '50px', height: '50px', padding: '7px', borderRadius: '50%' }} />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                </div>
                                <h3 style={{ padding: '30px', backgroundColor: 'white', margin: '10px', textAlign: 'center', fontSize: 24, color: '#ba343b' }}>{t('stayTuned')}</h3>
                                <h4 style={{ padding: '10px', backgroundColor: 'white', margin: '10px', marginLeft: '1rem', borderRadius: '5px', marginTop: '15px', fontSize: 20, color: '#ba343b' }}>{t('analyticsOverview')}</h4>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <div className='charts' style={{ background: 'white', padding: '20px', margin: '10px', height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={combinedData} height={400}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="maxPosts" stroke="#000" name="Max Posts" />
                                            <Line type="monotone" dataKey="dailyPosts" stroke="#d9686e" name="Daily Posts" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <div className='charts' style={{ background: 'white', padding: '20px', margin: '10px', marginTop: '0px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={filteredMaxData} width={500}
                                            height={400}
                                            margin={{
                                                top: 10,
                                                right: 30,
                                                left: 10,
                                                bottom: 0,
                                            }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="maxPosts" fill="#d9686e" name="Max Posts" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <Card className='mystyle' sx={{ width: 270, height: 300, margin: 1 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 18, textAlign: 'center', color: '#fff', bgcolor: '#ba343b', padding: '5px', borderRadius: '5px' }} gutterBottom>
                                                {t('scheduledpost')}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                                                {t('scheduledpostdesc')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ width: 270, height: 300, margin: 1 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 18, textAlign: 'center', color: '#fff', bgcolor: '#ba343b', padding: '5px', borderRadius: '5px' }} gutterBottom>
                                                {t('recentpost')}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                                                {t('recentpostdesc')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ width: 270, height: 300, margin: 1 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 18, textAlign: 'center', color: '#fff', bgcolor: '#ba343b', padding: '5px', borderRadius: '5px' }} gutterBottom>
                                                {t('publishedpost')}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                                                {t('publishedpostdesc')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ width: 270, height: 300, margin: 1 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 18, textAlign: 'center', color: '#fff', bgcolor: '#ba343b', padding: '5px', borderRadius: '5px' }} gutterBottom>
                                                {t('draft')}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                                                {t('draftdesc')}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>
            <div className="icon-container">
                <Link to='/reference-video'><FaCirclePlay className="circle-icon" /></Link>
                <div className="hover-content">{t('referencevideo')}</div>
            </div>
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

export default Dashboard;