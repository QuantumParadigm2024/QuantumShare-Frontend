import React from 'react';
import { FaCheckCircle } from "react-icons/fa";
import Box from '@mui/material/Box';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slide1 from '../Assets/slide1.webp';
import slide2 from '../Assets/slide2.webp';
import slide3 from '../Assets/slide3.webp';
import slide4 from '../Assets/slide4.webp';
import slide5 from '../Assets/slide5.webp';
import slide6 from '../Assets/slide6.webp';
import slide7 from '../Assets/slide7.webp';
import slide8 from '../Assets/InCollage.webp';
import InstaSlideShow1 from './InstaSlideShow1';
import InstaSlideShow2 from './InstaSlideShow2';

const firstSetImages = [slide1, slide2, slide3, slide4];
const secondSetImages = [slide5, slide6, slide7, slide8];

const InstagramInfo = () => {

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <section className='connect'>
                        <article>
                            <h2 style={{ textAlign: 'center', color: '#ba343b', fontSize: '30px' }}>Connect your Instagram to Facebook Page</h2>
                            <br />
                            <div id='connection'>
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Open Meta Business Suite on your Facebook Profile. Navigate to page management window.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Select an option to Connect Instagram account and login with Instagram.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Grant the required permissions to allow Meta Business Suite to access and manage your Instagram messages.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Add your Instagram account to your business portfolio.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Instagram connected successful popup window will appear.</p>
                                </div>
                            </div>
                            <br />
                            <div className="slider-container">
                                <InstaSlideShow1 images={firstSetImages} />
                            </div>
                            <br /><br /><br />
                            <div>
                                <h2 style={{ textAlign: 'center', color: '#ba343b' }}>Change your Instagram account to a business account</h2>
                                <br />
                                <div id='connection'>
                                    <div className='circle1'>
                                        <div><FaCheckCircle className='checkCricle' /></div>
                                        <p style={{ fontSize: '17px' }}>Go to your profile, tap on your profile picture or profile icon.</p>
                                    </div><br />
                                    <div className='circle1'>
                                        <div><FaCheckCircle className='checkCricle' /></div>
                                        <p style={{ fontSize: '17px' }}>Select "Settings" in setting click on Account type and tools and select "Switch to Professional Account."</p>
                                    </div><br />
                                    <div className='circle1'>
                                        <div><FaCheckCircle className='checkCricle' /></div>
                                        <p style={{ fontSize: '17px' }}>Select "Business" as your account type. And click on "Done" to complete the process</p>
                                    </div><br />
                                </div>
                            </div>
                            <br />
                            <div className="slider-container">
                                <InstaSlideShow2 images={secondSetImages} />
                            </div>
                        </article>
                    </section>
                </Box>
            </Box>
        </div>
    )
}

export default InstagramInfo;