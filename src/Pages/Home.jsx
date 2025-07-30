/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Box, Button, Grid, Typography, Container, Paper } from '@mui/material';
import Nav from '../Navbar/Nav'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import Alert from '@mui/material/Alert';
import why from '../Assets/home.webp'
import about1 from '../Assets/about 1.webp'
import about2 from '../Assets/about2.webp'
import about3 from '../Assets/about-company-3.webp'
import feature1 from '../Assets/features-1.webp'
import feature2 from '../Assets/tabs-3.webp'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TelegramIcon from '@mui/icons-material/Telegram';
import ImageIcon from '@mui/icons-material/Image';
import PowerIcon from '@mui/icons-material/Power';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import AOS from 'aos';
import { motion } from "framer-motion"
import { FaCirclePlay } from "react-icons/fa6";
import { CgPlayButtonO } from "react-icons/cg";
import { useTranslation } from 'react-i18next';

const Home = () => {

    useEffect(() => {
        AOS.init({ duration: 2000 });
    }, []);

    const token = localStorage.getItem('qs')
    const [open, setOpen] = React.useState(false);
    const {t} = useTranslation();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [isMuted, setIsMuted] = React.useState(false);
    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{t('quantumShare1')}</title>
                    <meta name="description" content="Quantum Share offers a seamless and secure way to share files and posts across social media. Revolutionize your sharing experience with our easy-to-use, privacy-focused platform." />
                    <link rel="canonical" href='/home' />
                </Helmet>
            </HelmetProvider>
            <Nav />
            <Grid container spacing={2} className='homeMainGrid01'>
                <Grid item xs={12} md={6} lg={6} className='homeSubGrid01'>
                    <img className='homeImg01' src={why} alt="image" />
                </Grid>
                <Grid item xs={12} md={6} lg={6} className='homeSubGrid02'>
                    <div className='homeMainDiv01' style={{ marginLeft: '10px' }}>
                        <div className='homeSubDiv01'>
                            <h2 className='homeh2Hdr01'> {t('revolutionizeYour')} <br /> {t('socialSharingExperience')} </h2>
                            <p className='homeContent01'>
                            {t('quantumShareIntro')}
                            </p>
                        </div>
                    </div>
                    <div className='homeMainDiv02'>
                        <Typography className='homeTypography01' gutterBottom>
                            <span className='homeSpan01' style={{ fontSize: '19px' }}>{t('watchNow')}</span>
                            <IconButton>
                                <CgPlayButtonO className='homeCgPlayButtonO' onClick={handleClickOpen} />
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogContent>
                                        <video autoPlay loop muted={isMuted} style={{ width: '100%', height: 'auto' }}>
                                            <source src="https://quantumshare.quantumparadigm.in/vedio/QP%20ADD%20VDIEO%202024.mp4" type="video/mp4" />
                                            {t('browserNotSupportVideo')}
                                        </video>
                                        <IconButton onClick={toggleMute} style={{ position: 'absolute', left: '10px', color: '#BA343B' }}>
                                            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                        </IconButton>
                                    </DialogContent>
                                </Dialog>
                            </IconButton>
                        </Typography>
                        <div className='homeSubDiv02'>
                            <Link to="/signUp">
                                <button className='homeButton01'>
                                    {t('getStartedFree')}
                                </button>
                            </Link>
                        </div>
                    </div>
                </Grid>
                <Grid className='homeSubGrid03'>
                    <Grid item xs={12} md={12} lg={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: 'easeOut', delay: "0.5" }}
                            className='homeMotionDiv01'
                        >
                            <Card className='mystyle' sx={{ width: 350, height: 120, margin: 1, marginLeft: "15px", boxShadow: "none", backgroundColor: '#fbf4f5' }} elevation={12}>
                                <CardContent>
                                    <div className='homeDivParent'>
                                        <div className='homeDivChild01'>
                                            <Typography>
                                                <div className="homeDivChild001">
                                                    <InsertLinkIcon style={{ color: 'white', margin: "20px", width: '40px', height: '40px' }}></InsertLinkIcon>
                                                </div>
                                            </Typography>
                                        </div>
                                        <div className='homeDivChild02'>
                                            <Typography className='home-text' sx={{ fontSize: '18', color: 'black', fontWeight: 600, paddingTop: "5px" }}>Connecting Your Accounts</Typography>
                                            <Typography sx={{ fontSize: 14, marginTop: '7px', fontWeight: '600' }} color="text.secondary" gutterBottom>
                                                {t('linkAccounts')}.</Typography>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className='mystyle' sx={{ width: 350, height: 120, margin: 1, marginLeft: "15px", boxShadow: "none", backgroundColor: '#fbf4f5' }} elevation={12}>
                                <CardContent>
                                    <div className='homeDivParent'>
                                        <div className='homeDivChild01'>
                                            <Typography>
                                                <div className="homeDivChild001">
                                                    <MapsUgcIcon style={{ color: 'white', margin: "20px", width: '40px', height: '40px' }}></MapsUgcIcon>
                                                </div>
                                            </Typography>
                                        </div>
                                        <div className='homeDivChild02'>
                                            <Typography className='home-text' sx={{ fontSize: '18', color: 'black', fontWeight: 600, paddingTop: "5px" }}> {t('customizeTextWithAI')}</Typography>
                                            <Typography sx={{ fontSize: 14, marginTop: '7px', fontWeight: '600' }} color="text.secondary" gutterBottom>
                                               {t('transformMessages')} </Typography>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className='mystyle' sx={{ width: 350, height: 120, margin: 1, marginLeft: "15px", boxShadow: "none", backgroundColor: '#fbf4f5' }} elevation={12}>
                                <CardContent>
                                    <div className='homeDivParent'>
                                        <div className='homeDivChild01'>
                                            <Typography>
                                                <div className="homeDivChild001">
                                                    <AutoFixHighIcon style={{ color: 'white', margin: "20px", width: '40px', height: '40px' }}></AutoFixHighIcon>
                                                </div>
                                            </Typography>
                                        </div>
                                        <div className='homeDivChild02'>
                                            <Typography className='home-text' sx={{ fontSize: '18', color: 'black', fontWeight: 600, paddingTop: "5px" }}>{t('createAIImages')} </Typography>
                                            <Typography sx={{ fontSize: 14, marginTop: '7px', fontWeight: '600' }} color="text.secondary" gutterBottom>
                                                {t('aiImageExperience')}  </Typography>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ paddingTop: "15px", backgroundColor: "white" }}>
                    <motion.div initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: "0.7" }}
                        className='homeMotionDiv02'>
                        <div className='homeDiv01'>
                            <Grid item xs={12} md={12} lg={12} sx={{ textAlign: 'start' }}>
                                <p className='homeWhoWeAre'>{t('whoWeAre')}</p>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} sx={{ textAlign: 'start' }}>
                                <h1 className='homeWhyChoose'>{t('whyCompaniesChoose')}</h1>
                            </Grid>
                            <div className='homeDiv02' style={{ display: 'flex', marginLeft: "20px" }}>
                                <div>
                                    <Typography style={{ paddingTop: "20px", color: '#3e5055', fontStyle: "italic", fontSize: "20px" }}>{t('leverageQuantumShare')} </Typography>
                                    <Alert style={{ paddingLeft: "0px", fontSize: "18px", paddingTop: "30px" }} variant="white" severity="success" border="1px solid white">{t('getToMarketQuickly')}</Alert>
                                    <Alert style={{ paddingLeft: "0px", fontSize: "18px" }} variant="white" severity="success" >{t('reliableAndTrusted')}</Alert>
                                    <Alert style={{ paddingLeft: "0px", fontSize: "18px" }} variant="white" severity="success" >{t('minimalMaintenance')}</Alert>
                                    <div style={{ textAlign: 'center', margin: '1rem', marginLeft: "-200px", marginTop: "50px" }}>
                                        <Link to='/about'>
                                            <Button variant="contained" sx={{ backgroundColor: '#ba343b', cursor: 'pointer', '&:hover': { bgcolor: '#9e2b31' }, fontWeight: '600' }}>{t('readMore')}</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={5.9} lg={5.9} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "white" }}>
                    <Grid item xs={12} md={12} lg={12} sx={{ backgroundColor: "white" }}>
                        <motion.img initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: 'easeOut', delay: "0.7" }} style={{ paddingBottom: "10px", paddingRight: "10px", borderRadius: "20px", width: "100%", height: "auto", }} src={about1} alt="image" ></motion.img> </Grid>
                    <Grid item xs={12} md={12} lg={12} sx={{ backgroundColor: "white", display: "grid", gridTemplateRows: "auto auto" }}>
                        <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "white" }}>
                            <motion.img initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: 'easeOut', delay: "0.7" }} style={{ paddingBottom: "5px", borderRadius: "20px", width: "100%", height: "auto", display: 'flex', justifyContent: 'center', alignItems: 'center' }} src={about2} alt="image" ></motion.img>
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "white" }}>
                            <motion.img initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: 'easeOut', delay: "0.7" }} style={{ paddingBottom: "10px", paddingTop: "5px", borderRadius: "20px", width: "100%", height: "auto", display: 'flex', justifyContent: 'center', alignItems: 'center' }} src={about3} alt="image" ></motion.img>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={11.9} lg={11.9} sx={{ backgroundColor: "#ffffff" }}>
                    <h1 style={{ textAlign: "center", paddingTop: "30px", paddingBottom: '40px', color: '#d3040c', fontSize: "2.5rem", fontWeight: '600' }}>{t('howQuantumShareWorks')}</h1>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ marginTop: "0px", backgroundColor: "white" }}>
                    <img style={{ marginLeft: "50px", borderRadius: "25px", width: "80%", }} src={feature1} alt="image"></img>
                </Grid>
                <Grid item xs={12} md={5.9} lg={5.9} sx={{ paddingTop: "15px", backgroundColor: '#fbf4f5', marginBottom: "40px", borderRadius: '16px', width: '80%' }}>
                    <Typography sx={{ fontSize: 17, marginTop: '7px', paddingBottom: "15px" }} style={{ paddingRight: '15px', marginRight: "20px", paddingLeft: '10px', paddingTop: '8px', fontWeight: '500' }} color="black" gutterBottom>
                        {t('quantumShareInt')}   
                    </Typography>
                    <Typography sx={{ fontSize: 17, marginTop: '7px', paddingBottom: "15px", paddingTop: "10px" }} style={{ paddingRight: '15px', marginRight: "20px", paddingLeft: '10px', fontWeight: '500' }} color="black" gutterBottom>
                        {t('effortlessContentPosting')}    
                    </Typography>
                    <Typography sx={{ fontSize: 17, marginTop: '7px', paddingTop: "15px" }} style={{ paddingRight: '15px', marginRight: "20px", paddingLeft: '10px', paddingBottom: '25px', fontWeight: '500' }} color="black" gutterBottom>
                        {t('upcomingFeatures')}    
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ backgroundColor: "white", marginTop: "10px" }}>
                    <Card className='mystyle' id="hover-div" sx={{ width: "85%", height: "auto", marginLeft: "30px", boxShadow: "none", backgroundColor: '#fbf5f7', borderRadius: "25px" }} elevation={12}>
                        <CardContent>
                            <div style={{ display: "grid", gridTemplateColumns: "10% 90%" }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', marginTop: '6px', borderRadius: "20px" }}>
                                    <TelegramIcon style={{ color: '#b24252', width: '30px', height: '30px', marginTop: "5px", marginLeft: "6px" }}></TelegramIcon>
                                </div>
                                <div>
                                    <Typography className='home-text' sx={{ fontSize: '25px', fontWeight: 900, paddingTop: "10px", paddingLeft: "15px", color: "#45454d" }}>{t('sendPosts')}</Typography>
                                </div>
                            </div>
                            <div style={{ marginLeft: '15px' }}>
                                <Typography sx={{ fontSize: 17, marginTop: '7px', paddingBottom: "15px", paddingTop: "10px" }} style={{ paddingRight: '15px', marginRight: "20px", paddingLeft: '10px', fontWeight: '500' }} color="black" gutterBottom>
                                    {t('sendPostsDescription')} </Typography>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='mystyle' id="hover-div" sx={{ width: "85%", height: "auto", marginLeft: "30px", boxShadow: "none", backgroundColor: '#fbf4f5', marginTop: "15px", borderRadius: "25px" }} elevation={12}>
                        <CardContent>
                            <div style={{ display: "grid", gridTemplateColumns: "10% 90%" }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', marginTop: '6px', borderRadius: "20px" }}>
                                    <ImageIcon style={{ color: '#b24252', width: '30px', height: '30px', marginTop: "5px", marginLeft: "6px" }}></ImageIcon>
                                </div>
                                <div>
                                    <Typography className='home-text' sx={{ paddingTop: "10px", paddingLeft: "15px", color: "#45454d", fontSize: '25px', fontWeight: 900, }}> {t('manageMedia')}</Typography>
                                </div>
                            </div>
                            <div style={{ marginLeft: '15px' }}>
                                <Typography sx={{ fontSize: 17, marginTop: '7px', paddingBottom: "15px", paddingTop: "10px" }} style={{ paddingRight: '15px', marginRight: "20px", paddingLeft: '10px', fontWeight: '500' }} color="black" gutterBottom>
                                   {t('manageMediaDescription')}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='mystyle' id="hover-div" sx={{ width: "85%", height: "auto", marginLeft: "30px", boxShadow: "none", backgroundColor: '#fbf4f5', marginTop: "15px", borderRadius: "25px" }} elevation={12}>
                        <CardContent>
                            <div style={{ display: "grid", gridTemplateColumns: "10% 90%" }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: 'white', marginTop: '6px', borderRadius: "20px" }}>
                                    <PowerIcon style={{ color: '#b24252', width: '30px', height: '30px', marginTop: "5px", marginLeft: "6px" }}></PowerIcon>
                                </div>
                                <div>
                                    <Typography className='home-text' sx={{ paddingTop: "10px", paddingLeft: "15px", color: "#45454d", fontSize: '25px', fontWeight: 900, }}>{t('integrations')} </Typography>
                                </div>
                            </div>
                            <div style={{ marginLeft: '15px' }}>
                                <Typography sx={{ fontSize: 17, marginTop: '7px', paddingBottom: "15px", paddingTop: "10px" }} style={{ paddingRight: '15px', marginRight: "20px", paddingLeft: '10px', fontWeight: '500' }} color="black" gutterBottom>
                                   {t('integrationsDescription')}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5.9} lg={5.9} sx={{ display: 'flex', justifyContent: 'center', backgroundColor: "white" }}>
                    <img style={{ paddingBottom: "10px", marginLeft: '10px', paddingRight: "10px", width: "100%", height: "auto", display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px' }} src={feature2} alt="image" ></img>
                </Grid>
            </Grid >
            <div className="icon-container">
                <Link to='/reference-video'><FaCirclePlay className="circle-icon" /></Link>
                <div className="hover-content">{t('referencevideo')}</div>
            </div>
            <Footer />
        </>
    );
}

const Footer = () => {
    return (
        <Box p={2} textAlign="center" bgcolor="#ba343b">
            <Typography variant="body1" color='#fff' textAlign="center">
                &copy; {new Date().getFullYear()} Quantum Share. All rights reserved | <Link to='/privacy-policy' id="privacy">Privacy Policy</Link>
            </Typography>
        </Box>
    );
}

export default Home;