import React from 'react'
import { FaCheckCircle } from "react-icons/fa";
import Box from '@mui/material/Box';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddBotImage1 from '../Assets/AddBotImage-1.webp';
import AddBotImage2 from '../Assets/AddBotImage-2.webp';
import AddBotImage3 from '../Assets/AddBotImage-3.webp';
import AddBotImage4 from '../Assets/AddBotImage-4.webp';
import AddBotImage5 from '../Assets/AddBotImage-5.webp';
import BotCodeImage from '../Assets/BotCodeImage.webp';
import BotMessage from '../Assets/BotMessage.webp';
import TeleSlideShow1 from './TeleSlideShow1';

const firstSetImages = [AddBotImage1, AddBotImage2, AddBotImage3, AddBotImage4, AddBotImage5, BotCodeImage, BotMessage]

const TelegramInfo = () => {

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <section className='connect'>
                        <article>
                            <h2 style={{ textAlign: 'center', color: '#ba343b', fontSize: '30px' }}>Telegram Linking</h2>
                            <br />
                            <p style={{ textAlign: 'center', marginLeft: '1rem', fontSize: '18px' }}>Telegram utilizes bots to allow posting to your group or channel. You will need to give admin access to the QuantumShare Telegram Bot to enable publishing and deleting.</p>
                            <br />
                            <div id='tele' style={{ textAlign: 'center', marginLeft: '1.5rem' }}>
                                <p style={{ marginTop: '0.2rem', fontSize: '18px' }}> &#x1F6C8; You must have administrative access to the channel or group to add a bot. Telegram channel posts show the channel name and logo as the author. Telegram group posts show the QuantumShare name and logo as the author.</p>
                            </div>
                            <br />
                            <h2 style={{ fontSize: '22px', marginLeft: '2rem', color: '#ba343b' }}>Connect Telegram</h2>
                            <br />
                            <div id='connection'>
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Open your Telegram Group and go to the <b>"Add Members"</b> section.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Click on <b>"Add Members"</b>, then search for <b>"QuantumShare"</b>. When <b>"QuantumShare_bot"</b> appears, click on it and add it to your group.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Once QuantumShare is added to your group, long-press on it and select <b>"Promote to admin"</b>.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>On the Admin Rights page, click on the checkmark in the top right corner.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>QuantumShare will now be successfully added and will appear as an admin in the group info.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>In your Social Integration Dashboard you will be given a Telegram access code, when you click on the Telegram Connect.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Copy the code part.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>In your Telegram group at the chat prompt, paste this code and press tap the send button.</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Once posting the message or code in a Group or Channel, <b>Please click on OK</b>. If success, you will get a success message in the chat.</p>
                                </div><br />
                                <div id='teleg' style={{ textAlign: 'center', marginLeft: '18rem' }}>
                                    <p style={{ marginTop: '0.2rem', fontSize: '17px' }}> &#x1F6C8; Please wait a few minutes for a Succes response in Telegram Chat</p>
                                </div><br />
                                <div className='circle1'>
                                    <div><FaCheckCircle className='checkCricle' /></div>
                                    <p style={{ fontSize: '17px' }}>Thus, the Telegram integration is complete. You can now publish via QuantumShare.</p>
                                </div>
                            </div>
                            <br />
                            <div className="slider-container">
                                <TeleSlideShow1 images={firstSetImages} />
                            </div>
                            <br /><br /><br />

                        </article>
                    </section>
                </Box>
            </Box>
        </div>
    )
}

export default TelegramInfo