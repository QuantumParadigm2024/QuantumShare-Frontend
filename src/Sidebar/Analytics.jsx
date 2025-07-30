/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Nav from '../Navbar/Nav';
import Sidenav from '../Navbar/Sidenav';
import { Link } from 'react-router-dom';
import axiosInstance from '../Helper/AxiosInstance';
import DialogTitle from '@mui/material/DialogTitle';
import { Share } from '@mui/icons-material';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import facebookIcon from '../Assets/facebooksmall.svg';
import instagramIcon from '../Assets/instagramsmall.svg';
import youtubeIcon from '../Assets/youtubesmall.svg';
import linkedInIcon from '../Assets/linkedinsmall.svg';
import { ReactSVG } from 'react-svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { PieChart as MuiPieChart } from '@mui/x-charts';
import { TailSpin } from 'react-loader-spinner';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import PieChart from './PieCharts';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';
import { useDispatch, useSelector } from 'react-redux';
import { FetchUser } from '../Redux/FetchUser';

const Analytics = () => {
    const { remainingDays, trail, subscription } = useSelector((state) => state.data);
    const dispatch = useDispatch();
    const [showPopup, setShowPopup] = useState(false);
    const [recentPosts, setRecentPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [viewMoreOpen, setViewMoreOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [postsToDisplay, setPostsToDisplay] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recentLoading, setRecentLoding] = useState(true);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const { t } = useTranslation('');

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
        console.log("Calling FetchUser...");
        FetchUser(dispatch, setShowPopup);
    }, [dispatch]);

    useEffect(() => {
        console.log("Trial:", trail, "Subscription:", subscription, "Remaining Days:", remainingDays);
        if (trail === false && subscription === false && remainingDays === 0) {
            setShowPopup(true);
        }
    }, [trail, subscription, remainingDays]);

    const fetchAnalyticsData = async () => {
        try {
            const response = await axiosInstance.get('/quantum-share/socialmedia/history', {
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            setRecentPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching analytics data", error);
            if (error.response?.data?.code === 121) {
                console.log('1');
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            }
        } finally {
            setRecentLoding(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [token]);

    const handleViewInsights = async (pid) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/quantum-share/socialmedia/view/analytics?pid=${pid}`, {
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            setSelectedPost(response.data);
            setErrorMessage(null);
            setOpen(true);
        } catch (error) {
            if (error.response?.data?.code === 121) {
                console.log('2');

                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            } else if (error.response && error.response.data) {
                const { message, platform } = error.response.data;
                setErrorMessage(`Error on ${platform}: ${message}`);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            setSelectedPost(null);
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleViewInsightsClose = () => {
        setOpen(false);
        setSelectedPost(null);
        fetchAnalyticsData();
    };

    const getPlatformIcon = (platformName) => {
        switch (platformName.toLowerCase()) {
            case 'facebook':
                return <ReactSVG src={facebookIcon} alt="Facebook" />;
            case 'instagram':
                return <ReactSVG src={instagramIcon} alt="Instagram" />;
            case 'youtube':
                return <ReactSVG src={youtubeIcon} alt="Youtube" />;
            case 'linkedin':
                return <ReactSVG src={linkedInIcon} alt="Youtube" />;
            default:
                return null;
        }
    };

    const handleViewMore = async () => {
        try {
            const response = await axiosInstance.get(`/quantum-share/socialmedia/history/viewMore`, {
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            setPostsToDisplay(response.data.data);
            setViewMoreOpen(true);
        } catch (error) {
            console.error('Error fetching more posts:', error);
            if (error.response?.data?.code === 121) {
                console.log('3');
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            }
        }
    };

    const handleViewMoreClose = () => {
        setViewMoreOpen(false);
    };

    const iconStyle = {
        position: 'absolute',
        top: '55%',
        right: '10px',
        objectFit: 'contain',
        transform: 'translateY(-50%)',
    };

    const data = [
        {
            name: 'Jan',
            competitors: 13,
            followers: 24,
            no: 50,
        },
        {
            name: 'Feb',
            competitors: 21,
            followers: 13,
        },
        {
            name: 'Mar',
            competitors: 32,
            followers: 8,
        },
        {
            name: 'Apr',
            competitors: 43,
            followers: 39,
        },
        {
            name: 'May',
            competitors: 25,
            followers: 40,
        },
        {
            name: 'Jun',
            competitors: 16,
            followers: 30,
        },
    ];

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
                    <div style={{ flexGrow: 1 }} >
                        {recentLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                                <TailSpin height="40" width="40" color="#ba343b" ariaLabel="tail-spin-loading" radius="1" visible={true} />
                            </div>
                        ) : (
                            <>
                                <Box sx={{ flexGrow: 1, marginLeft: '2.5rem' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <div style={{ backgroundColor: 'white', padding: '20px', marginBottom: '20px', marginRight: '15px' }}>
                                                <h2 style={{ color: '#ba343b', fontSize: '1.4rem' }}>{t('recentPosts')}</h2><br />
                                                <Grid container spacing={2}>
                                                    {recentPosts.filter(post => post.imageUrl).length > 0 ? (
                                                        <>
                                                            {recentPosts
                                                                .filter(post => post.imageUrl)
                                                                .map((post, index) => (
                                                                    <Grid item xs={3} key={post.pid} sx={{ marginBottom: (index + 1) % 4 === 0 ? '1.5rem' : '0' }}>
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                flexDirection: 'column',
                                                                                alignItems: 'center',
                                                                                border: '1px #ddd',
                                                                                borderRadius: '8px',
                                                                                padding: '6px',
                                                                                width: '90%',
                                                                                height: '295px',
                                                                                textAlign: 'center',
                                                                                backgroundColor: '#fefffa',
                                                                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                                                                position: 'relative',
                                                                                marginLeft: '10px',
                                                                                marginRight: '10px'
                                                                            }}
                                                                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'}
                                                                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                                                        >
                                                                            {post.mediaType.startsWith('video') ? (
                                                                                post.platformName === "facebook" || post.platformName === "youtube" ? (
                                                                                    <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                                                                                        <img
                                                                                            src={post.imageUrl}
                                                                                            alt="Video Thumbnail"
                                                                                            style={{
                                                                                                width: '90%',
                                                                                                height: '180px',
                                                                                                objectFit: 'contain',
                                                                                                borderRadius: '4px',
                                                                                            }}
                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                border: '2px solid white',
                                                                                                position: 'absolute',
                                                                                                top: '50%',
                                                                                                left: '50%',
                                                                                                transform: 'translate(-50%, -50%)',
                                                                                                width: '40px',
                                                                                                height: '40px',
                                                                                                borderRadius: '50%',
                                                                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent: 'center',
                                                                                                zIndex: 1,
                                                                                            }}
                                                                                        >
                                                                                            <button
                                                                                                style={{
                                                                                                    position: 'relative',
                                                                                                    bottom: '1px',
                                                                                                    left: '2px',
                                                                                                    backgroundColor: 'transparent',
                                                                                                    color: 'white',
                                                                                                    border: 'none',
                                                                                                    fontSize: '18px',
                                                                                                    cursor: 'pointer',
                                                                                                }}
                                                                                            >
                                                                                                ▶
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                                                                                        <video
                                                                                            src={post.imageUrl}
                                                                                            alt="Video"
                                                                                            style={{
                                                                                                width: '90%',
                                                                                                height: '180px',
                                                                                                objectFit: 'contain',
                                                                                                borderRadius: '4px',
                                                                                            }}
                                                                                        />
                                                                                        <div
                                                                                            style={{
                                                                                                border: '2px solid white',
                                                                                                position: 'absolute',
                                                                                                top: '50%',
                                                                                                left: '50%',
                                                                                                transform: 'translate(-50%, -50%)',
                                                                                                width: '40px',
                                                                                                height: '40px',
                                                                                                borderRadius: '50%',
                                                                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent: 'center',
                                                                                                zIndex: 1,
                                                                                            }}
                                                                                        >
                                                                                            <button
                                                                                                style={{
                                                                                                    position: 'relative',
                                                                                                    bottom: '1px',
                                                                                                    left: '2px',
                                                                                                    backgroundColor: 'transparent',
                                                                                                    color: 'white',
                                                                                                    border: 'none',
                                                                                                    fontSize: '18px',
                                                                                                    cursor: 'pointer',
                                                                                                }}
                                                                                            >
                                                                                                ▶
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            ) : (
                                                                                <img
                                                                                    src={post.imageUrl}
                                                                                    alt="Image"
                                                                                    style={{
                                                                                        width: '90%',
                                                                                        height: '180px',
                                                                                        objectFit: 'contain',
                                                                                        borderRadius: '4px',
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            <div
                                                                                style={{
                                                                                    position: 'absolute',
                                                                                    top: '-4px',
                                                                                    right: '-4px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    width: '27px',
                                                                                    height: '27px',
                                                                                }}
                                                                            >
                                                                                {getPlatformIcon(post.platformName)}
                                                                            </div>
                                                                            <div>
                                                                                <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333', marginTop: '10px' }}>
                                                                                    {post.profileName}
                                                                                </p>
                                                                                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                                                                                    {post.postDate}, {post.postTime}
                                                                                </p>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => handleViewInsights(post.pid)}
                                                                                style={{
                                                                                    backgroundColor: '#fff',
                                                                                    color: '#ba343b',
                                                                                    border: '1px solid #ba343b',
                                                                                    borderRadius: '4px',
                                                                                    width: '7rem',
                                                                                    height: '2.1rem',
                                                                                    cursor: 'pointer',
                                                                                    fontSize: '14px',
                                                                                    fontWeight: '600',
                                                                                    position: 'absolute',
                                                                                    bottom: '15px',
                                                                                    left: '50%',
                                                                                    transform: 'translateX(-50%)',
                                                                                    marginRight: '20px'
                                                                                }}
                                                                            >
                                                                                {t('viewInsights')}
                                                                            </button>
                                                                        </div>
                                                                    </Grid>

                                                                ))}
                                                            {recentPosts.filter(post => post.imageUrl).length >= 10 && (
                                                                <Grid item xs={3}>
                                                                    <div
                                                                        style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            border: '1px dashed #ba343b',
                                                                            borderRadius: '8px',
                                                                            padding: '6px',
                                                                            width: '900',
                                                                            height: '295px',
                                                                            textAlign: 'center',
                                                                            backgroundColor: 'transparent',
                                                                            cursor: 'pointer',
                                                                            transition: 'background-color 0.3s ease-in-out',
                                                                        }}
                                                                        onClick={handleViewMore}
                                                                    >
                                                                        <span style={{ color: '#ba343b', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                                            View More
                                                                        </span>
                                                                    </div>
                                                                </Grid>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div style={{ margin: '0 16px' }}>
                                                            <p>{t('noRecentPosts')}</p>
                                                        </div>
                                                    )}
                                                </Grid>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={{ flexGrow: 1, marginLeft: '1rem' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12} lg={12}>
                                            <div style={{ backgroundColor: 'white', padding: '20px', marginLeft: '25px', marginRight: '10px' }}>
                                                <h2 style={{ color: '#ba343b', fontSize: '1.18rem' }}>
                                                    {t('performanceSummary')}
                                                </h2>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        flexWrap: 'wrap',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            border: 1,
                                                            borderStyle: 'ridge',
                                                            padding: '15px',
                                                            width: '200px',
                                                            maxWidth: '30%',
                                                            flex: '1 1 auto',
                                                            minWidth: '180px',
                                                        }}
                                                    >
                                                        <p style={{ fontSize: 16 }}>{t('profileVisitors')}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ color: '#000066', fontWeight: 'bold', fontSize: 30, margin: '10px' }}>621</p>
                                                            <CallMadeIcon sx={{ marginTop: '10px', fontSize: 16, color: 'green' }} />
                                                            <p style={{ color: 'green', fontSize: 10, marginTop: '10px' }}>52.4%</p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            border: 1,
                                                            borderStyle: 'ridge',
                                                            padding: '15px',
                                                            width: '200px',
                                                            maxWidth: '30%',
                                                            flex: '1 1 auto',
                                                            minWidth: '180px',
                                                        }}
                                                    >
                                                        <p style={{ fontSize: 16 }}>{t('postViewCounts')}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ color: '#000066', fontWeight: 'bold', fontSize: 30, margin: '10px' }}>7,256</p>
                                                            <CallReceivedIcon sx={{ marginTop: '10px', fontSize: 16, color: 'red' }} />
                                                            <p style={{ color: 'red', fontSize: 10, marginTop: '10px' }}>5.2%</p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            border: 1,
                                                            borderStyle: 'ridge',
                                                            padding: '15px',
                                                            width: '200px',
                                                            maxWidth: '30%',
                                                            flex: '1 1 auto',
                                                            minWidth: '180px',
                                                        }}
                                                    >
                                                        <p style={{ fontSize: 16 }}>{t('engagement')}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ color: '#000066', fontWeight: 'bold', fontSize: 30, margin: '10px' }}>23,142</p>
                                                            <CallMadeIcon sx={{ marginTop: '10px', fontSize: 16, color: 'green' }} />
                                                            <p style={{ color: 'green', fontSize: 10, marginTop: '10px' }}>72.3%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={6}>
                                            <div className='charts' style={{ background: 'white', padding: '10px', margin: '5px', marginLeft: '35px', marginRight: '30px' }}>
                                                <ResponsiveContainer width="100%" height={250} minHeight={150} >
                                                    <BarChart
                                                        data={data}
                                                        margin={{
                                                            top: 5,
                                                            right: 5,
                                                            left: 5,
                                                            bottom: 5,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis >
                                                            <Label value="Activity In Percentage" angle={-90} position="insideLeft" offset={0} style={{ textAnchor: 'middle' }} />
                                                        </YAxis>
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="followers" fill="#d9686e" />
                                                        <Bar dataKey="competitors" fill="#f5cbcd" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={6} lg={6} >
                                            <div style={{ background: '#fff', padding: '20px', paddingRight: '5px', marginLeft: '20px', marginRight: '15px' }}>
                                                <p>{t('postEngagement')}</p>
                                                <div style={{ padding: '18px' }}>
                                                    <MuiPieChart
                                                        series={[
                                                            {
                                                                data: [
                                                                    { id: 0, value: 10, label: 'Text', color: '#e48d91' },
                                                                    { id: 1, value: 15, label: 'Image', color: '#f5cbcd' },
                                                                    { id: 2, value: 20, label: 'Video', color: '#d9686e' },
                                                                ],
                                                            },
                                                        ]}
                                                        width={200}
                                                        height={200}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12} lg={12}>
                                            <div style={{ backgroundColor: 'white', padding: '20px', marginLeft: '25px', marginRight: '5px' }}>
                                                <h2 style={{ color: '#ba343b', fontSize: '1.2rem' }}>
                                                    {t('audienceSummary')}
                                                </h2>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        flexWrap: 'wrap',
                                                        gap: '10px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            border: 1,
                                                            borderStyle: 'ridge',
                                                            padding: '15px',
                                                            width: '200px',
                                                            maxWidth: '30%',
                                                            flex: '1 1 auto',
                                                            minWidth: '180px'
                                                        }}
                                                    >
                                                        <p style={{ fontSize: 16 }}>{t('followers')}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ color: '#000066', fontWeight: 'bold', fontSize: 30, margin: '10px' }}>1423</p>
                                                            <CallMadeIcon sx={{ marginTop: '10px', fontSize: 16, color: 'green' }} />
                                                            <p style={{ color: 'green', fontSize: 10, marginTop: '10px' }}>20.1%</p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            border: 1,
                                                            borderStyle: 'ridge',
                                                            padding: '15px',
                                                            width: '200px',
                                                            maxWidth: '30%',
                                                            flex: '1 1 auto',
                                                            minWidth: '180px'
                                                        }}
                                                    >
                                                        <p style={{ fontSize: 16 }}>{t('likes')}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ color: '#000066', fontWeight: 'bold', fontSize: 30, margin: '10px' }}>5,642</p>
                                                            <CallMadeIcon sx={{ marginTop: '10px', fontSize: 16, color: 'green' }} />
                                                            <p style={{ color: 'green', fontSize: 10, marginTop: '10px' }}>41.1%</p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            border: 1,
                                                            borderStyle: 'ridge',
                                                            padding: '15px',
                                                            width: '200px',
                                                            maxWidth: '30%',
                                                            flex: '1 1 auto',
                                                            minWidth: '180px'
                                                        }}
                                                    >
                                                        <p style={{ fontSize: 16 }}>{t('comments')}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ color: '#000066', fontWeight: 'bold', fontSize: 30, margin: '10px' }}>1,023</p>
                                                            <CallMadeIcon sx={{ marginTop: '10px', fontSize: 16, color: 'green' }} />
                                                            <p style={{ color: 'green', fontSize: 10, marginTop: '10px' }}>32.0%</p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            border: 1,
                                                            borderStyle: 'ridge',
                                                            padding: '15px',
                                                            width: '200px',
                                                            maxWidth: '30%',
                                                            flex: '1 1 auto',
                                                            minWidth: '180px'
                                                        }}
                                                    >
                                                        <p style={{ fontSize: 16 }}>{t('dislikes')}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <p style={{ color: '#000066', fontWeight: 'bold', fontSize: 30, margin: '10px' }}>20</p>
                                                            <CallReceivedIcon sx={{ marginTop: '10px', fontSize: 16, color: 'red' }} />
                                                            <p style={{ color: 'red', fontSize: 10, marginTop: '10px' }}>8.6%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        )}
                    </div>
                </div>
                <Dialog open={viewMoreOpen} onClose={handleViewMoreClose} maxWidth="lg" fullWidth>
                    <DialogTitle sx={{ color: '#ba343b', fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}>
                        {t('allPosts')}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            {postsToDisplay.map((post, index) => (
                                <Grid item xs={3} key={post.pid} sx={{ marginBottom: (index + 1) % 4 === 0 ? '1rem' : '0' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            border: '1px #ddd',
                                            borderRadius: '8px',
                                            padding: '6px',
                                            width: '90%',
                                            height: '295px',
                                            textAlign: 'center',
                                            backgroundColor: '#fefffa',
                                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                            position: 'relative',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                    >
                                        {post.mediaType.startsWith('video') ? (
                                            post.platformName === "facebook" || post.platformName === "youtube" ? (
                                                <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                                                    <img
                                                        src={post.imageUrl}
                                                        alt="Video Thumbnail"
                                                        style={{
                                                            width: '90%',
                                                            height: '180px',
                                                            objectFit: 'contain',
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            border: '2px solid white',
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <button
                                                            style={{
                                                                position: 'relative',
                                                                bottom: '1px',
                                                                left: '2px',
                                                                backgroundColor: 'transparent',
                                                                color: 'white',
                                                                border: 'none',
                                                                fontSize: '18px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            ▶
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                                                    <video
                                                        src={post.imageUrl}
                                                        alt="Video"
                                                        style={{
                                                            width: '90%',
                                                            height: '180px',
                                                            objectFit: 'contain',
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            border: '2px solid white',
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <button
                                                            style={{
                                                                position: 'relative',
                                                                bottom: '1px',
                                                                left: '2px',
                                                                backgroundColor: 'transparent',
                                                                color: 'white',
                                                                border: 'none',
                                                                fontSize: '18px',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            ▶
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <img
                                                src={post.imageUrl}
                                                alt="Image"
                                                style={{
                                                    width: '90%',
                                                    height: '180px',
                                                    objectFit: 'contain',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        )}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '-4px',
                                                right: '-4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '27px',
                                                height: '27px',
                                            }}
                                        >
                                            {getPlatformIcon(post.platformName)}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333', marginTop: '10px' }}>
                                                {post.profileName}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                                                {post.postDate}, {post.postTime}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleViewInsights(post.pid)}
                                            style={{
                                                backgroundColor: '#fff',
                                                color: '#ba343b',
                                                border: '1px solid #ba343b',
                                                borderRadius: '4px',
                                                width: '7rem',
                                                height: '2.1rem',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                position: 'absolute',
                                                bottom: '15px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                            }}
                                        >
                                            {t('viewInsights')}
                                        </button>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleViewMoreClose} style={{ color: '#ba343b' }}>
                            {t('close')}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress sx={{ color: '#ba343b' }} size={40} />
                </Backdrop>
                <Dialog open={open} onClose={handleViewInsightsClose} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ color: '#ba343b', fontSize: '1.2rem', fontWeight: '600', position: 'relative', paddingRight: '70px' }}>
                        {t('postInsights')}
                        {selectedPost && selectedPost.platform && (
                            <>
                                {selectedPost.platform === 'instagram' && (
                                    <ReactSVG src={instagramIcon} alt="Instagram" style={iconStyle} />
                                )}
                                {selectedPost.platform === 'facebook' && (
                                    <ReactSVG src={facebookIcon} alt="Facebook" style={iconStyle} />
                                )}
                                {selectedPost.platform === 'youtube' && (
                                    <ReactSVG src={youtubeIcon} alt="Youtube" style={iconStyle} />
                                )}
                                {selectedPost.platform === 'linkedin' && (
                                    <ReactSVG src={linkedInIcon} alt="Linkedin" style={iconStyle} />
                                )}
                            </>
                        )}
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedPost && selectedPost.status === 'error' ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <p style={{ color: '#ee6c6e', fontWeight: '600', textAlign: 'center' }}>
                                        {selectedPost.message}
                                    </p>
                                </Grid>
                            </Grid>
                        ) : (
                            selectedPost && (
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        {selectedPost.platform === 'facebook' && selectedPost.data.media_type.startsWith('video') ? (
                                            <img
                                                src={selectedPost.data.full_picture}
                                                alt="Facebook Post Thumbnail"
                                                style={{ width: '100%', height: '250px', borderRadius: '4px', objectFit: 'contain' }}
                                            />
                                        ) : selectedPost.data.media_type.startsWith('video') ? (
                                            selectedPost.data.full_picture.includes('youtube.com') || selectedPost.data.full_picture.includes('youtu.be') ? (
                                                <iframe
                                                    width="100%"
                                                    height="250"
                                                    src={`https://www.youtube.com/embed/${new URL(selectedPost.data.full_picture).searchParams.get("v")}?rel=0&modestbranding=1&controls=1&disablekb=1&cc_load_policy=0&fs=0`}
                                                    title="YouTube video player"
                                                    style={{ borderRadius: '4px', objectFit: 'contain' }}
                                                ></iframe>
                                            ) : (
                                                <video
                                                    src={selectedPost.data.full_picture}
                                                    alt="Post"
                                                    style={{ width: '100%', height: '250px', borderRadius: '4px', objectFit: 'contain' }}
                                                    controls
                                                />
                                            )
                                        ) : (
                                            <img
                                                src={selectedPost.data.full_picture}
                                                alt="Post"
                                                style={{ width: '100%', height: '250px', borderRadius: '4px', objectFit: 'contain' }}
                                            />
                                        )}
                                        <br /><br />
                                        <p>{selectedPost.data.description}</p>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {/* Facebook */}
                                        {selectedPost.data.total_comments !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <CommentOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Comments : {selectedPost.data.total_comments}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.love !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <FavoriteBorderOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Love : {selectedPost.data.love}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.like !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <ThumbUpAltOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Likes : {selectedPost.data.like}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.total_video_views !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <VisibilityOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Views : {selectedPost.data.total_video_views}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.total_video_impressions !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <InsightsOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Impressions : {selectedPost.data.total_video_impressions}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.reactions !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <SentimentVerySatisfiedOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Reactions : {selectedPost.data.reactions}</span>
                                            </p>
                                        )}
                                        {/* Instagram */}
                                        {selectedPost.data.comments !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <CommentOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Comments : {selectedPost.data.comments}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.likes !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <FavoriteBorderOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Likes : {selectedPost.data.likes}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.shares !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <Share sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Shares : {selectedPost.data.shares}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.saved !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <BookmarksOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Saved : {selectedPost.data.saved}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.reach !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <TrendingUpOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Reach : {selectedPost.data.reach}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.media_type === 'video' && selectedPost.data.ig_reels_video_view_total_time !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <VisibilityOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Views : {selectedPost.data.ig_reels_video_view_total_time}</span>
                                            </p>
                                        )}
                                        {/* Youtube */}
                                        {selectedPost.data.media_type === 'video/mp4' && selectedPost.data.commentCount !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <CommentOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Comments : {selectedPost.data.commentCount}</span>
                                            </p>
                                        )}
                                        {/* {selectedPost.data.media_type === 'video/mp4' && selectedPost.data.viewCount !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <VisibilityOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Views : {selectedPost.data.viewCount}</span>
                                            </p>
                                        )} */}
                                        {/* {selectedPost.data.media_type === 'video/mp4' && selectedPost.data.likeCount !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <FavoriteBorderOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Likes : {selectedPost.data.likeCount}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.media_type === 'video/mp4' && selectedPost.data.favoriteCount !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <StarBorderPurple500OutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Favourite : {selectedPost.data.favoriteCount}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.media_type === 'video/mp4' && selectedPost.data.dislikeCount !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <ThumbDownOffAltOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Dislikes : {selectedPost.data.dislikeCount}</span>
                                            </p>
                                        )} */}
                                        {/* LinkedIn */}
                                        {selectedPost.data.comments !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <CommentOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Comments : {selectedPost.data.comments}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.LIKE !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <FavoriteBorderOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Likes : {selectedPost.data.LIKE}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.PRAISE !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <TrendingUpOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Praise : {selectedPost.data.PRAISE}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.EMPATHY !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <TrendingUpOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Empathy : {selectedPost.data.EMPATHY}</span>
                                            </p>
                                        )}
                                        {selectedPost.data.media_type === 'video' && selectedPost.data.views !== undefined && (
                                            <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <VisibilityOutlinedIcon sx={{ color: 'grey', fontSize: '20px', marginRight: '8px' }} />
                                                <span style={{ fontWeight: '600' }}>Views : {selectedPost.data.views}</span>
                                            </p>
                                        )}
                                    </Grid>
                                    <Grid item xs={4}>
                                        <PieChart data={selectedPost.data} platform={selectedPost.platform} />
                                    </Grid>
                                </Grid>
                            )
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleViewInsightsClose} style={{ color: '#ba343b' }}>
                            {t('close')}
                        </Button>
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
            </div >

        </>
    );
};
export default Analytics;