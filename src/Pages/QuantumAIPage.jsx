import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Nav from '../Navbar/Nav';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import bg from '../Assets/one.webp'
import text from '../Assets/AIImage-1.webp'
import img from '../Assets/AIImage-2.webp'
import generated1 from '../Assets/Generated-Image-01.webp'
import generated2 from '../Assets/Generated-Image-02.webp'
import generated3 from '../Assets/Generated-Image-03.webp'
import Sidenav from '../Navbar/Sidenav';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { FaCirclePlay } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

const QuantumAIPage = () => {
    const token = localStorage.getItem('qs')
    const {t} = useTranslation('');

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{t('quantumAI1')}</title>
                    <meta name="description" content="Discover the transformative power of Quantum AI, your ultimate companion for generating stunning visuals and compelling text effortlessly. With advanced capabilities in AI text creation, Quantum crafts high-quality content that engages and resonates with your audience. Elevate your projects with stunning images and innovative graphics that bring your ideas to life. Experience seamless creativity and watch your visions become reality with Quantum AI, where imagination meets cutting-edge technology." />
                    <link rel="canonical" href='/Features' />
                </Helmet>
            </HelmetProvider>
            <div>
                <Nav />
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex' }}>
                        {token && <Sidenav />}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{
                                    backgroundImage: `url(${bg})`, backgroundSize: 'cover',
                                    backgroundPosition: 'center', textAlign: 'center', paddingBottom: '30px'
                                }}>
                                    <h1 style={{ paddingTop: '60px' }}>{t('achieveMore')}</h1>
                                    <p style={{ fontSize: 20, margin: '70px', marginTop: '40px' }}>{t('meetQuantum')}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <h1>{t('aiTextCreation')}</h1>
                                    <img src={text} alt="" style={{ margin: '20px', width: '900px', maxWidth: '100%' }} />
                                    <p style={{ marginTop: '10px', fontSize: 20, margin: '20px', marginBottom: '40px', marginLeft: '50px' }}>
                                       {t('quantumText')}    
                                     </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <h1>{t('aiImageGenerate')}</h1>
                                    <img src={img} alt="" style={{ margin: '20px', width: '900px', maxWidth: '100%' }} />
                                    <p style={{ marginTop: '10px', fontSize: 20, margin: '20px', marginBottom: '40px', marginLeft: '50px' }}>
                                    {t('quantumImage')}    
                                    </p>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <h1>{t('generatedImages')}</h1>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', flexFlow: 'wrap' }}>
                                    <img src={generated1} alt="" style={{ margin: '20px' }} />
                                    <img src={generated2} alt="" style={{ margin: '20px' }} />
                                    <img src={generated3} alt="" style={{ margin: '20px' }} />
                                </div>
                            </Grid>

                        </Grid>
                    </Box>
                </Box>
            </div >
            <div className="icon-container">
                <Link to='/reference-video'><FaCirclePlay className="circle-icon" /></Link>
                <div className="hover-content">reference video</div>
            </div>
            <Footer />
        </>
    )
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

export default QuantumAIPage