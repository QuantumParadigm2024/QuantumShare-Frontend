/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Button, Tooltip, Popover, Zoom, Checkbox, Radio } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { CiCirclePlus } from "react-icons/ci";
import { useSelector } from 'react-redux';
import FacebookIcon from '../Assets/facebooksmall.svg';
import LinkedinIcon from '../Assets/linkedinsmall.svg';
import InstagramIcon from '../Assets/instagramsmall.svg'
import TelegramIcon from '../Assets/telegramsmall.svg'
import YoutubeIcon from '../Assets/youtubesmall.svg'
import RedditIcon from '../Assets/redditsm1.svg';
import PinterestIcon from '../Assets/pinterestsmall.png'
import { useTranslation } from 'react-i18next';

const Media = ({ onMediaPlatform, postSubmitted }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showPopover, setShowPopover] = useState(false);
    const [submittedIcons, setSubmittedIcons] = useState([]);
    const [mediaPlatform, setMediaPlatform] = useState([]);

    const isLoggedIn = useSelector((state) => state.loginStatus.isLoggedIn);
    const instaLoggedIn = useSelector((state) => state.loginStatus.instaLoggedIn);
    const telLoggedIn = useSelector((state) => state.loginStatus.telLoggedIn);
    const linkLoggedIn = useSelector((state) => state.loginStatus.linkLoggedIn);
    const YouLoggedIn = useSelector((state) => state.loginStatus.YouLoggedIn);
    const redditLoggedIn = useSelector((state) => state.loginStatus.redditLoggedIn);
    const pinterestLoggedIn = useSelector((state) => state.loginStatus.pinterestLoggedIn);

    const instagramUrl = useSelector((state) => state.imageUrls.instagramUrl);
    const pageUrls = useSelector((state) => state.imageUrls.pageUrls);
    const telegramProfileUrl = useSelector((state) => state.imageUrls.telegramProfileUrl);
    const linkedinprofile = useSelector((state) => state.imageUrls.linkedinprofile);
    const youtubeProfile = useSelector((state) => state.imageUrls.youtubeProfile);
    const redditProfile = useSelector((state) => state.imageUrls.redditProfile);
    const pinterestProfile = useSelector((state) => state.imageUrls.pinterestProfile);

    const fbpagename = useSelector((state) => state.profilename.fbpagename);
    const instaname = useSelector((state) => state.profilename.instaname)
    const linkname = useSelector((state) => state.profilename.linkname)
    const youname = useSelector((state) => state.profilename.youname)
    const telname = useSelector((state) => state.profilename.telname)
    const redditname = useSelector((state) => state.profilename.redditname);
    const pinterestname = useSelector((state) => state.profilename.pinterestname);

    const { t } = useTranslation('');

    const PinterestBoards = useSelector((state) => state.boards.PinterestBoards)

    const mediaPlatforms = [
        { id: 'facebook', icon: pageUrls, name: 'facebook', isLoggedIn, profileUrl: fbpagename },
        { id: 'instagram', icon: instagramUrl, name: 'instagram', isLoggedIn: instaLoggedIn, profileUrl: instaname },
        { id: 'telegram', icon: telegramProfileUrl, name: 'telegram', isLoggedIn: telLoggedIn, profileUrl: telname },
        { id: 'LinkedIn', icon: linkedinprofile, name: 'LinkedIn', isLoggedIn: linkLoggedIn, profileUrl: linkname },
        { id: 'youtube', icon: youtubeProfile, name: 'youtube', isLoggedIn: YouLoggedIn, profileUrl: youname },
        { id: 'Reddit', icon: redditProfile, name: 'Reddit', isLoggedIn: redditLoggedIn, profileUrl: redditname },
        { id: 'pinterest', icon: pinterestProfile, name: 'pinterest', isLoggedIn: pinterestLoggedIn, profileUrl: pinterestname },
    ];
    console.log(mediaPlatform);

    const handleSelectIconAndSendToParent = (platform) => {
        const index = mediaPlatform.indexOf(platform.name);
        let updatedPlatforms = [...mediaPlatform];
        if (index === -1) {
            updatedPlatforms.push(platform.name);
        } else {
            updatedPlatforms.splice(index, 1);
        }
        setMediaPlatform(updatedPlatforms);
        const platformString = updatedPlatforms.join(",");
        console.log(platformString);
        onMediaPlatform(updatedPlatforms, platformString);
    }

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setShowPopover(true);
    }

    const handlePopoverClose = () => {
        if (showPopover) {
            setShowPopover(false);
            setMediaPlatform(submittedIcons);
        }
    };

    const handleSubmit = () => {
        setSubmittedIcons(mediaPlatform);
        setShowPopover(false);
    };

    const handleCancel = () => {
        if (showPopover) {
            setShowPopover(false);
            setMediaPlatform(submittedIcons);
            const platformString = submittedIcons.join(',');
            onMediaPlatform(submittedIcons, platformString);
        }
    };

    const platformIcon = {
        facebook: FacebookIcon,
        instagram: InstagramIcon,
        LinkedIn: LinkedinIcon,
        telegram: TelegramIcon,
        youtube: YoutubeIcon,
        Reddit: RedditIcon,
        pinterest: PinterestIcon,
    }

    useEffect(() => {
        if (postSubmitted) {
            setSubmittedIcons([])
            setMediaPlatform([])
        }
    }, [postSubmitted])

    return (
        <div>
            <Tooltip TransitionComponent={Zoom} enterDelay={100} leaveDelay={100}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {submittedIcons.length === 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', minWidth: '120px' }}>
                            <span style={{ fontSize: '14px', color: 'black' }}>{t('selectSocialMedia')}</span>
                        </div>
                    )}
                    <IconButton>
                        <CiCirclePlus style={{ fontSize: '30px' }} onClick={handlePopoverOpen} />
                    </IconButton>
                    {submittedIcons.map((iconName, index) => {
                        const platform = mediaPlatforms.find(p => p.name === iconName);
                        return (
                            <div
                                key={index}
                                className="selected-icon"
                                style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    margin: '10px'
                                }}>
                                <img
                                    src={platform.icon}
                                    alt={`Profile for ${iconName}`}
                                    style={{
                                        width: '35px',
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <img
                                    src={platformIcon[iconName]}
                                    alt={`${iconName} Logo`}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        right: '0',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: '0.5px white'
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <Popover
                    open={showPopover}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    slotProps={{
                        style: {
                            borderRadius: '10px',
                            padding: '10px',
                            width: '380px',
                            overflow: 'auto',
                            height: '230px',
                        },
                    }}
                >
                    <Typography sx={{ p: 2, maxWidth: '350px' }}>
                        <Tooltip style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div
                                className='box-container-soc'
                                style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '230px', padding: '10px' }}
                            >
                                {mediaPlatforms.some((platform) => platform.isLoggedIn) ? (
                                    mediaPlatforms
                                        .filter((platform) => platform.isLoggedIn)
                                        .map((platform) => (
                                            <div
                                                key={platform.id}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    padding: '10px',
                                                    backgroundColor: mediaPlatform.includes(platform.name) ? '#f0f0f0' : 'transparent',
                                                    borderRadius: '10px',
                                                    transition: 'background-color 0.3s ease',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                    handleSelectIconAndSendToParent(platform)
                                                }
                                            >
                                                <Checkbox
                                                    checked={mediaPlatform.includes(platform.name)}
                                                    color="primary"
                                                    style={{ padding: '0 10px 0 0' }}
                                                />
                                                <img
                                                    src={platform.icon}
                                                    alt={`${platform.name} icon`}
                                                    style={{
                                                        marginRight: '10px',
                                                        width: '35px',
                                                        height: '35px',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                                    <span style={{ fontSize: '14px', color: 'black' }} >
                                                        {platform.name}
                                                    </span>
                                                    <span style={{ fontSize: '10px', color: '#aaa' }} >
                                                        {platform.profileUrl}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div style={{ padding: '10px', textAlign: 'start', color: '#888' }} >
                                        {t('connectToSocialMedia')}
                                    </div>
                                )}                           
                            </div>
                        </Tooltip>
                    </Typography>
                    <Button variant="outlined" color="error" sx={{ marginTop: 'auto', padding: '5px 5px', transform: 'translate(20px,-10px)' }} onClick={handleCancel} >
                        {t('cancel')}
                    </Button>
                    <Button variant="contained" sx={{ marginTop: 'auto', padding: '5px 10px', transform: 'translate(100px,-10px)' }} onClick={handleSubmit}  >
                        {t('submit')}
                    </Button>
                </Popover>
            </Tooltip>
        </div>
    );
}

export default Media;