/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext, useRef } from "react";
import { Grid, Tooltip, Popover, Zoom, Radio, CircularProgress } from "@mui/material";
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import EmojiPicker from "emoji-picker-react";
import Media from './Media'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../Helper/AxiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { ImageContext } from "../Context/ImageContext";
import Webcam from 'react-webcam';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { FaVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearAiText, updateCaption } from "../Redux/action/AiTextSlice";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import QI from './QI';
import TagIcon from '@mui/icons-material/Tag';
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, IconButton, Typography, DialogTitle } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import {
    ThumbUpAltOutlined,
    ChatBubbleOutline,
    ShareTwoTone,
    FavoriteBorderOutlined,
    SendOutlined,
    BookmarkOutlined,
    Repeat,
    Send,
    CommentOutlined,
    ArrowDownward,
    ArrowUpward,
    Chat,
    ThumbDownAltOutlined,
} from '@mui/icons-material';
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Avatar,
} from '@mui/material';
import { ReactComponent as InstagramIcon } from '../Assets/instagramsmall.svg';
import { ReactComponent as FacebookIcon } from '../Assets/facebooksmall.svg';
import { ReactComponent as LinkedInIcon } from '../Assets/linkedinsmall.svg';
import { ReactComponent as YoutubeIcon } from '../Assets/youtubesmall.svg';
import { ReactComponent as RedditIcon } from '../Assets/redditSmall.svg';
import { ReactComponent as TelegramIcon } from '../Assets/telegramsmall.svg';
import { Link } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';
import { FetchUser } from "../Redux/FetchUser";
import { CircleLoader } from "react-spinners";

const Post = ({ onClose }) => {
    const { remainingDays, trail, subscription } = useSelector((state) => state.data);
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const [open1, setOpen1] = useState(false);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [scheduleDateTime, setScheduleDateTime] = useState(null);
    const [caption, setCaption] = useState('');
    const [title, setTitle] = useState('');
    const [visibility, setVisibility] = useState("public");
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
    const [shareButtonDisabled, setShareButtonDisabled] = useState(true);
    const [commentValue, setCommentValue] = useState('');
    const [changesMade, setChangesMade] = useState(false);
    const [selectedIcons, setSelectedIcons] = useState([]);
    const [mediaPlatform, setMediaPlatform] = useState([]);
    const { image1 } = useContext(ImageContext);
    const [showBox, setShowBox] = useState(false);
    const [disableMainTooltip, setDisableMainTooltip] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const boxRef = useRef(null);
    const tooltipTimerRef = useRef(null);
    const webcamRef = useRef(null)
    const mediaRecorderRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [sr, setSr] = useState('');
    const [postSubmitted, setPostSubmitted] = useState(false)
    const [AIopen, setAIopen] = useState(false)
    const AiText = useSelector((state) => state.Aitext.AiText)
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [noHashtagMessage, setNoHashtagMessage] = useState("");
    const [showInput, setShowInput] = useState(false);
    const { t } = useTranslation();
    const [isSessionExpired, setIsSessionExpired] = useState(false);

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

    const handleSubscriptionClose = () => {
        setShowPopup(false);
        closeDialog(false);
    }

    const platformData = {
        instagram: { profilePic: InstagramIcon, username: 'Instagram', bgcolor: 'transparent' },
        facebook: { profilePic: FacebookIcon, username: 'Facebook', bgcolor: 'transparent' },
        LinkedIn: { profilePic: LinkedInIcon, username: 'LinkedIn', bgcolor: 'transparent' },
        youtube: { profilePic: YoutubeIcon, username: 'Youtube', bgcolor: 'transparent' },
        Reddit: { profilePic: RedditIcon, username: 'Reddit', bgcolor: 'transparent' },
        Telegram: { profilePic: TelegramIcon, username: 'Telegram', bgcolor: 'transparent' },
    };
    const [instaShowMore, setInstaShowMore] = useState(false)
    const [fbShowMore, setFbShowMore] = useState(false)
    const [redditShowmore, setRedditShowmore] = useState(false)
    const [youtubeShowmore, setYoutubeShowmore] = useState(false)
    const maxLength = 150
    const toggleShowMore1 = () => setInstaShowMore((prev) => !prev);
    const toggleShowMore2 = () => setFbShowMore((prev) => !prev);
    const toggleShowMore3 = () => setRedditShowmore((prev) => !prev);
    const toggleShowMore4 = () => setYoutubeShowmore((prev) => !prev);

    const handleSelectIconAndSendToParent = (mediaPlatform) => {
        setMediaPlatform(mediaPlatform);
        if (!mediaPlatform.includes('youtube') && !mediaPlatform.includes('Reddit')) {
            setTitle('');
        }
        if (!mediaPlatform.includes('Reddit')) {
            setSr('');
        }
        console.log(mediaPlatform);
    };

    const [warningMessages, setWarningMessages] = useState([]);
    const maxTitleCharacters = 100;
    const maxCaptionCharacters = 500;

    const closeDialog = () => {
        console.log("closeDialog triggered");
        setOpen(false);
        setFile(null);
        setFileType('');
        setSelectedOption('');
        setScheduleDateTime(null);
        setTitle('');
        setCaption('');
        dispatch(updateCaption(''));
        setCommentValue('');
        setMediaPlatform([]);
        setQuery('');
        setSuggestions([]);
        setNoHashtagMessage('');
        setShowInput(false);
        onClose();
    };

    useEffect(() => {
        if (open) {
            const handleBackNavigation = () => {
                closeDialog();
                return false;
            };

            window.history.pushState(null, '', location.pathname);
            window.addEventListener('popstate', handleBackNavigation);

            return () => {
                window.removeEventListener('popstate', handleBackNavigation);
            };
        }
    }, [open, location.pathname]);

    const validatePlatforms = () => {
        let newWarningMessages = [];
        let shouldDisableShare = false;

        if (!file && !caption) {
            newWarningMessages.push("A post cannot be shared without either text or media.");
            shouldDisableShare = true;
        }

        if (file && !mediaPlatform.length) {
            newWarningMessages.push("Please select at least one media platform to share the post.");
            shouldDisableShare = true;
        }
        if (mediaPlatform.includes('youtube')) {
            if (!title) {
                newWarningMessages.push("Please enter a title for YouTube.");
                shouldDisableShare = true;
            } else if (fileType !== 'video') {
                if (mediaPlatform.length > 1) {
                    newWarningMessages.push(
                        "The selected image will be shared to all selected platforms except YouTube. Only video files can be shared to YouTube."
                    );
                    shouldDisableShare = true;
                } else {
                    newWarningMessages.push(
                        "Only video files can be shared to YouTube. Please select a video."
                    );
                    shouldDisableShare = true;
                }
            }
        }
        if (mediaPlatform.includes('pinterest')) {
            if (!title) {
                newWarningMessages.push("Please enter a title for Pinterest.");
                shouldDisableShare = true;
            }
        }
        if (mediaPlatform.includes('Reddit')) {
            if (!title || !sr) {
                if (!title) newWarningMessages.push("Please enter a title for Reddit.");
                if (!sr) newWarningMessages.push("Please enter a subreddit for Reddit.");
                shouldDisableShare = true;
            }
        }

        if (mediaPlatform.includes('Reddit') && fileType === 'video') {
            newWarningMessages.push(
                "Reddit does not support video sharing. Please remove the media or deselect Reddit."
            );
            shouldDisableShare = true;
        }

        if ((mediaPlatform.includes('instagram') || mediaPlatform.includes('youtube')) && !file) {
            newWarningMessages.push(
                "Instagram and YouTube only support media posts. The text will be shared to other platforms."
            );
            shouldDisableShare = true;
        }

        setWarningMessages(newWarningMessages);
        setShareButtonDisabled(shouldDisableShare);
    };

    useEffect(() => {
        if (!mediaPlatform.length && !file && !caption) {
            setWarningMessages(["A post cannot be shared without either text or media."]);
            setShareButtonDisabled(true);
        } else if (file && !mediaPlatform.length) {
            setWarningMessages(["Please select at least one media platform to share the post."]);
            setShareButtonDisabled(true);
        } else if (mediaPlatform.length > 0 && (file || caption)) {
            validatePlatforms();
        }
    }, [mediaPlatform, title, sr, file, fileType, caption]);

    const handleConfirmCloseOpen = () => {
        if (changesMade) {
            setCaption('');
            dispatch(clearAiText());
            setChangesMade(false);
            closeDialog();
            setQuery('');
            setSuggestions([]);
            setNoHashtagMessage('');
        } else {
            setCaption('');
            dispatch(clearAiText());
            closeDialog();
            setQuery('');
            setSuggestions([]);
            setNoHashtagMessage('');
        }
    };

    const handleCameraClick = () => {
        setShowCamera(true);
        setShowBox(false);
        setDisableMainTooltip(false);
        clearTimeout(tooltipTimerRef.current);
    };

    const handleGalleryClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const imageSizeLimit = 4.5 * 1024 * 1024;
            const videoSizeLimit = 40 * 1024 * 1024;

            if (isImage && file.size > imageSizeLimit) {
                toast.error("Image size is too large! Maximum allowed is 4.5MB.");
                return;
            }
            if (isVideo && file.size > videoSizeLimit) {
                toast.error("Video size is too large! Maximum allowed is 40MB.");
                return;
            }

            let processedFile = file;
            if (isVideo && file.type !== 'video/mp4') {
                toast.error("Only MP4 videos are supported. Please upload an MP4 file.");
                return;
            }
            const unsupportedImageFormats = ['image/heic', 'image/tiff'];
            if (isImage && unsupportedImageFormats.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const filePreviewUrl = e.target.result;
                    setFile(file);
                    setImageUrl(filePreviewUrl);
                };
                reader.readAsDataURL(file);
            } else {
                setFile(file);
                setImageUrl(URL.createObjectURL(file));
            }

            setFileType(isImage ? 'image' : 'video');
            setShareButtonDisabled(false);
            console.log('File selected:', processedFile);
        }
    };

    const handleClickOutside = (event) => {
        if (boxRef.current && !boxRef.current.contains(event.target)) {
            setShowBox(false);
            setDisableMainTooltip(false);
            clearTimeout(tooltipTimerRef.current);
        }
    };

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();

        const byteCharacters = atob(imageSrc.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        const file = new File([blob], 'captured_image.png', { type: 'image/png' });

        setFile(file);
        setFileType('image');
        setShareButtonDisabled(false);
        setShowCamera(false);
    };

    const handleStartRecording = async () => {
        if (!isRecording) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = handleDataAvailable;
            console.log(stream);
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } else {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            const videoFile = new File([event.data], 'recorded_video.webm', { type: 'video/webm' });
            console.log(videoFile);
            setFile(videoFile);
            setFileType('video');
            setShareButtonDisabled(false);
            setShowCamera(false);
        }
    };

    useEffect(() => {
        if (showBox) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(tooltipTimerRef.current);
        };
    }, [showBox]);

    useEffect(() => {
        if (image1) {
            setFileType('image');
            fetch(image1)
                .then(res => res.blob())
                .then(blob => {
                    const fileFromBlob = new File([blob], 'image1.png', { type: blob.type });
                    setFile(fileFromBlob);
                    setShareButtonDisabled(false);
                });
        }
    }, [image1]);

    const handleChangesMade = () => {
        setChangesMade(true);
    };

    const platformMappings = {
        'facebook': 'Facebook',
        'instagram': 'Instagram',
        'telegram': 'Telegram',
        'LinkedIn': 'LinkedIn',
        'youtube': 'Youtube',
        'Reddit': 'Reddit',
        'pinterest': 'Pinterest'
    };

    const getDisplayPlatformName = (platform) => {
        const lowercasePlatform = platform.toLowerCase();
        if (platformMappings[lowercasePlatform]) {
            return platformMappings[lowercasePlatform];
        } else {
            return platform.charAt(0).toUpperCase() + platform.slice(1);
        }
    };

    const getEndpointForPlatform = (platform) => {
        switch (platform) {
            case 'facebook':
                return '/quantum-share/post/file/facebook';
            case 'instagram':
                return '/quantum-share/post/file/instagram';
            case 'telegram':
                return '/quantum-share/post/file/telegram';
            case 'LinkedIn':
                return '/quantum-share/post/file/linkedIn';
            case 'youtube':
                return '/quantum-share/post/file/youtube';
            case 'Reddit':
                return '/quantum-share/post/file/reddit';
            case 'pinterest':
                return '/quantum-share/post/file/pinterest';
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    };

    const createFormData = (file, caption, title, visibility, boardName, platform, sr) => {
        const formData = new FormData();
        if (file) {
            formData.append('mediaFile', file);
        }
        formData.append('caption', caption);
        formData.append('title', title);
        formData.append('visibility', visibility);
        formData.append('boardName', boardName)
        formData.append('mediaPlatform', platform);
        formData.append('sr', sr);
        return formData;
    };

    const handleVisibilityChange = (event) => {
        setVisibility(event.target.value);
    };

    const handleSubmit = async () => {
        setConfirmCloseOpen(false);
        setOpen1(false);
        // const platforms = mediaPlatform.split(',');
        const platforms = Array.isArray(mediaPlatform) ? mediaPlatform : typeof mediaPlatform === 'string' ? mediaPlatform.split(',') : [];

        if (!platforms || platforms.length === 0) {
            toast.error('Please Select a Social Media Platform!');
            return;
        }
        try {
            const loadingToasts = platforms.map(platform =>
                toast.loading(`Posting to ${getDisplayPlatformName(platform)}...`)
            );
            const responses = await Promise.all(platforms.map(async platform => {
                const endpoint = getEndpointForPlatform(platform);
                console.log(endpoint)
                const formData = createFormData(file, caption, title, visibility, boardName, platform, sr, image1);
                try {
                    const response = await axiosInstance.post(endpoint, formData, {
                        headers: {
                            'Accept': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        params: { mediaPlatform: platform }
                    });
                    toast.dismiss(loadingToasts[platforms.indexOf(platform)]);
                    if (platform === 'facebook') {
                        if (Array.isArray(response.data)) {
                            response.data.forEach(async res => {
                                if (res.status === "success" && res.platform === "facebook") {
                                    toast.success(res.message);
                                } else if (res.status === "error" && res.code === 114) {
                                    console.error('Credit Depleted Error Message:', res.message);
                                    toast.info(res.message);
                                }
                            });
                        }
                    } else if (platform === 'instagram') {
                        if (response.data.success?.status === "success") {
                            const res = response.data.success;
                            toast.success(res.message);
                        } else if (response.data.code === 116) {
                            const res = response.data;
                            console.error('Unsupported Aspect Ratio:', res.message);
                            toast.info(res.message);
                        } else if (response.data.structure?.status === "error" && response.data.structure.code === 114) {
                            const res = response.data.structure;
                            console.error('Credit Depleted Error Message:', res.message);
                            toast.info(res.message);
                        } else if (response.data.structure?.code === 404) {
                            toast.error(response.data.structure.message);
                        }
                    } else if (platform === 'youtube') {
                        if (response.data.success && response.data.success.message) {
                            const res = response.data.success;
                            toast.success(res.message);
                        } else if (response.data.structure?.status === "error" && response.data.structure.code === 114) {
                            const res = response.data.structure;
                            console.error('Credit Depleted Error Message:', res.message);
                            toast.info(res.message);
                        } else if (response.data.structure?.code === 404) {
                            toast.error(response.data.structure.message);
                        } else if (response.data.structure?.code === 500) {
                            toast.error('YouTube: Failed to send media, Quota Exceeded Please try again after 24 hrs.');
                        }
                    } else if (platform === 'telegram') {
                        if (response.data.success?.status === "success") {
                            const res = response.data.success;
                            toast.success(res.message);
                        } else if (response.data.structure?.status === "error" && response.data.structure.code === 114) {
                            const res = response.data.structure;
                            console.error('Credit Depleted Error Message:', res.message);
                            toast.info(res.message);
                        } else if (response.data.structure?.code === 404) {
                            toast.error(response.data.structure.message);
                        }
                    } else if (platform === 'LinkedIn') {
                        if (response.data.structure && response.data.structure.message) {
                            const res = response.data.structure;
                            toast.success(res.message);
                        } else if (response.data.structure?.status === "error" && response.data.structure.code === 114) {
                            const res = response.data.structure;
                            console.error('Credit Depleted Error Message:', res.message);
                            toast.info(res.message);
                        } else if (response.data.structure?.code === 404) {
                            toast.error(response.data.structure.message);
                        }
                    } else if (platform === 'Reddit') {
                        if (response.data && response.data.message) {
                            console.log('sr', sr);
                            const res = response.data;
                            toast.success(res.message);
                        } else if (response.data.status === "error" && response.data.code === 114) {
                            const res = response.data;
                            console.error('Credit Depleted Error Message:', res.message);
                            toast.info(res.message);
                        } else if (response.data.code === 404) {
                            toast.error(response.data.message);
                        }
                    } else if (platform === 'pinterest') {
                        if (response.data.success && response.data.success.message) {
                            const res = response.data.success;
                            toast.success(res.message);
                        } else if (response.data.structure?.status === "error" && response.data.structure.code === 114) {
                            const res = response.data.structure;
                            console.error('Credit Depleted Error Message:', res.message);
                            toast.info(res.message);
                        } else if (response.data.structure?.code === 404) {
                            toast.error(response.data.structure.message);
                        }
                    }
                    return { platform, success: true };
                } catch (error) {
                    toast.dismiss(loadingToasts[platforms.indexOf(platform)]);
                    const responseData = error.response?.data || {};
                    if (error.response?.status === 403) {
                        toast.error('Forbidden: You do not have permission to access this resource.');
                    } else if (platform === 'facebook') {
                        if (error.response?.data?.code === 121) {
                            setIsSessionExpired(true);
                            localStorage.removeItem('qs');
                        } else if (Array.isArray(responseData)) {
                            responseData.forEach(err => {
                                if (err.status === "error" && err.code === 114) {
                                    console.error('Credit Depleted Error Message:', err.message);
                                    toast.info(err.message);
                                }
                            });
                        } else if (responseData.structure?.code === 404) {
                            toast.error(responseData.structure.message);
                        }
                    } else if (platform === 'instagram') {
                        if (error.response?.data?.code === 121) {
                            setIsSessionExpired(true);
                            localStorage.removeItem('qs');
                        } else if (responseData.code === 116) {
                            toast.info('Unsupported aspect ratio. Please use one of Instagram\'s formats: 4:5, 1:1, or 1.91:1.');
                        } else if (responseData.structure?.status === "error" && responseData.structure.code === 114) {
                            const err = responseData.structure;
                            console.error('Credit Depleted Error Message:', err.message);
                            toast.info(err.message);
                        } else if (responseData.structure?.code === 404) {
                            toast.error(responseData.structure.message);
                        }
                    } else if (platform === 'youtube') {
                        if (error.response?.data?.code === 121) {
                            setIsSessionExpired(true);
                            localStorage.removeItem('qs');
                        } else if (responseData.structure?.status === "error" && responseData.structure.code === 114) {
                            const err = responseData.structure;
                            console.error('Credit Depleted Error Message:', err.message);
                            toast.info(err.message);
                        } else if (responseData.structure?.code === 404) {
                            toast.error(responseData.structure.message);
                        } else if (responseData.structure?.code === 500) {
                            toast.error('YouTube: Failed to send media, Quota Exceeded Please try again after 24 hrs.');
                        }
                    } else if (platform === 'telegram') {
                        if (error.response?.data?.code === 121) {
                            setIsSessionExpired(true);
                            localStorage.removeItem('qs');
                        } else if (responseData.structure?.status === "error" && responseData.structure.code === 114) {
                            const err = responseData.structure;
                            console.error('Credit Depleted Error Message:', err.message);
                            toast.info(err.message);
                        } else if (responseData.structure?.code === 404) {
                            toast.error(responseData.structure.message);
                        }
                    } else if (platform === 'LinkedIn') {
                        if (error.response?.data?.code === 121) {
                            setIsSessionExpired(true);
                            localStorage.removeItem('qs');
                        } else if (responseData.structure?.status === "error" && responseData.structure.code === 114) {
                            const err = responseData.structure;
                            console.error('Credit Depleted Error Message:', err.message);
                            toast.info(err.message);
                        } else if (responseData.structure?.code === 404) {
                            toast.error(responseData.structure.message);
                        }
                    } else if (platform === 'Reddit') {
                        if (error.response?.data?.code === 121) {
                            setIsSessionExpired(true);
                            localStorage.removeItem('qs');
                        } else if (responseData.status === "error" && responseData.code === 114) {
                            const err = responseData;
                            console.error('Credit Depleted Error Message:', err.message);
                            toast.info(err.message);
                        } else if (responseData?.code === 404) {
                            toast.error(responseData.message);
                        }
                    } else if (platform === 'pinterest') {
                        if (error.response?.data?.code === 121) {
                            setIsSessionExpired(true);
                            localStorage.removeItem('qs');
                        } else if (responseData.structure?.status === "error" && responseData.structure.code === 114) {
                            const err = responseData.structure;
                            console.error('Credit Depleted Error Message:', err.message);
                            toast.info(err.message);
                        } else if (responseData.structure?.code === 404) {
                            toast.error(responseData.structure.message);
                        }
                    } else if (responseData.code === 115) {
                        toast.error("Token Expired, Please Login Again");
                        setTimeout(() => {
                            navigate("/login");
                        }, 4000);
                    } if (error.response?.data?.code === 121) {
                        setIsSessionExpired(true);
                        localStorage.removeItem('qs');
                    } else {
                        console.log('An error occurred while processing your request.');
                        toast.error('An error occurred while processing your request.');
                    }
                    return { platform, success: false };
                }
            }));
            resetState();
            setPostSubmitted(true);
        } catch (error) {
            console.error('Request failed:', error);
            toast.error('Request failed:', error.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    const resetState = () => {
        setFile(null);
        setFileType('');
        setSelectedOption('');
        setScheduleDateTime(null);
        setTitle('');
        setCaption('');
        setVisibility("public");
        setBoardName([]);
        setCommentValue('');
        setChangesMade(false);
        setSelectedIcons([]);
        setMediaPlatform([]);
        setImageUrl('');
        setQuery('');
        setSuggestions([]);
        setNoHashtagMessage('');
    };

    const convertImageToJPG = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg');
                };
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        if (newTitle.length <= maxTitleCharacters) { setTitle(newTitle); handleChangesMade(); }
    };

    const handleSubReddit = (e) => { setSr(e.target.value); handleChangesMade(); }

    // const handleCaptionChange = (e) => {
    //     const newCaption = e.target.value;
    //     if (newCaption.length <= maxCaptionCharacters) { setCaption(newCaption); dispatch(updateCaption(e.target.value)); setChangesMade(true); }
    // }
    // const handleCaptionChange = (e) => {
    //     const newCaption = e.target.value;
    //     if (newCaption.length <= maxCaptionCharacters) {
    //         setCaption(newCaption);
    //         // dispatch(updateCaption(newCaption)); // Uncomment if using Redux
    //         setChangesMade(true);
    //     }
    // };

    const handleCaptionChange = (e) => {
        const newCaption = e.target.value;
        if (newCaption.length <= maxCaptionCharacters) {
            setCaption(newCaption);
            // dispatch(updateCaption(newCaption)); // Uncomment if using Redux
            setChangesMade(true);
        }
    };
    const addEmoji = (e) => {
        if (e.unified.startsWith('1F1E6')) {
            const codePoints = e.unified.split('-').map((code) => parseInt(code, 16));
            const flagEmoji = String.fromCodePoint(...codePoints);
            setCaption((prevText) => prevText + flagEmoji);
        } else {
            const sym = e.unified.split('_');
            const codeArray = sym.map((el) => parseInt(el, 16));
            const emoji = String.fromCodePoint(...codeArray);
            setCaption((prevText) => prevText + emoji);
        }
        handleChangesMade();
    };

    const handleEmojiIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const fetchSuggestions = async (query) => {
        try {
            const response = await axiosInstance.get(`/quantum-share/Hashtag-suggestions`, {
                params: { query },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.data);
            console.log("Full Response:", response);
            console.log("Response Status:", response.data.status);
            console.log("Response Data:", response.data.data);
            if (response.data.status === "sucess" && response.data.data) {
                const hashtags = response.data.data;
                if (hashtags.length > 0) {
                    setSuggestions(hashtags);
                    setNoHashtagMessage("");
                } else {
                    setSuggestions([]);
                    setNoHashtagMessage("No hashtag found");
                }
            } else {
                setSuggestions([]);
                setNoHashtagMessage(response.data.message || "No hashtag found");
            }
        } catch (error) {
            console.error("Error fetching hashtag suggestions:", error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            }
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
    };

    const handleFetchClick = () => {
        if (query) {
            fetchSuggestions(query);
        }
    };

    const handleHashtagSelect = (hashtag) => {
        const updatedCaption = `${caption} ${hashtag}`.trim();
        if (updatedCaption.length <= maxCaptionCharacters) {
            setCaption(updatedCaption);
            dispatch(updateCaption(updatedCaption));
            setChangesMade(true);
        }
        setSuggestions(suggestions.filter((s) => s !== hashtag));
    };

    const handleIconClick = () => {
        setShowInput(!showInput);
        if (showInput) {
            setQuery('');
            setSuggestions([]);
            setNoHashtagMessage('');
        }
    };

    const handleClickOpen = () => {
        setOpen1(true);
    };

    const handleClose = () => {
        setOpen1(false);
    };

    useEffect(() => {
        if (image1) {
            setFileType('image');
            fetch(image1)
                .then(res => res.blob())
                .then(blob => {
                    const fileFromBlob = new File([blob], 'image1.png', { type: blob.type });
                    setFile(fileFromBlob);
                    setShareButtonDisabled(false);
                });
        }
    }, [image1]);

    const handleAIComponent = () => {
        setAIopen(!AIopen)
    }

    const handleAIClose = () => {
        setAIopen(false)
    }

    useEffect(() => {
        if (AiText) {
            setCaption(AiText)
        }
    }, [AiText])

    const PinterestBoards = useSelector((state) => state.boards.PinterestBoards)
    const [boardName, setBoardName] = useState([]);
    const [draftloading, setdraftloading] = useState(false)

    const handleBoardSelect = (event) => {
        setBoardName(event.target.value);
    };

    const handleSaveDraft = async () => {
        setdraftloading(true)
        const endpoint = '/quantum-share/post/saveDraft'
        const formData = createFormData(file, caption, title, visibility)
        try {
            const response = await axiosInstance.post(endpoint, formData, {
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            console.log(response);
            setOpen(false)
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setdraftloading(false)
        }
    }

    const [listening, setListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const recognitionRef = useRef(null);

    const languages = [
        { code: "en-US", name: "English (US)" },
        { code: "es-ES", name: "Spanish (Spain)" },
        { code: "hi-IN", name: "Hindi (India)" },
        { code: "kn-IN", name: "Kannada (India)" },
        { code: "fr-FR", name: "French (France)" },
        { code: "zh-CN", name: "Chinese (Mandarin)" },
        { code: "ja-JP", name: "Japanese" },
        { code: "ar-SA", name: "Arabic (Saudi Arabia)" },
    ];

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // single listen per click
        recognition.interimResults = false; // only final results

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            const finalText = caption + transcript + " ";
            if (finalText.length <= maxCaptionCharacters) {
                setCaption(finalText);
                setChangesMade(true);
            }
        };

        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [caption, maxCaptionCharacters]);

    const handleListen = () => {
        if (!recognitionRef.current) return;
        recognitionRef.current.lang = selectedLanguage;
        if (listening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
        if (listening && recognitionRef.current) {
            recognitionRef.current.stop();
            setListening(false);
        }
    };


    return (
        <>
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
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubscriptionClose}
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
                </DialogActions>
            </Dialog>
            <Dialog className="postContent" open={open} onClose={closeDialog} fullWidth maxWidth="lg">
                <DialogContent >
                    <Grid container spacing={1} >
                        <Grid item lg={7} md={7} xs={12} sx={{ p: 2 }} >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 id="newPost">New Post</h4>
                                <Media onMediaPlatform={handleSelectIconAndSendToParent} initialMediaPlatform={mediaPlatform} postSubmitted={postSubmitted} />
                            </div>
                            <div className="choose">
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {(mediaPlatform.includes('youtube') || mediaPlatform.includes('Reddit') || mediaPlatform.includes('pinterest')) && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: mediaPlatform.includes('Reddit') ? '48%' : '98%' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                                Title <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input required className="area" placeholder="Title... [Only for YouTube, Reddit & Pinterest]" value={title} name="title" onChange={handleTitleChange} style={{ height: '40px', width: '100%', border: '1px solid #ccc', borderRadius: '5px', resize: 'none', outline: 'none', fontSize: '12px', padding: '12px', paddingRight: '50px', boxSizing: 'border-box' }} />
                                            <span style={{ position: 'relative', top: '5px', fontSize: '10px', color: title.length === maxTitleCharacters ? 'red' : '#666' }}>{title.length}/{maxTitleCharacters}</span>
                                        </div>)}
                                    {mediaPlatform.includes('Reddit') && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '48.5%' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                                SubReddit <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input required className="area" placeholder="SubReddit... [Reddit]" value={sr} name="subreddit" onChange={handleSubReddit} style={{
                                                height: '40px', border: '1px solid #ccc', borderRadius: '5px', resize: 'none', outline: 'none', fontSize: '12px', padding: '12px'
                                            }} />
                                        </div>)}
                                </div>
                                <div style={{ position: 'relative', width: '98%', margin: '20px auto' }}>
                                    <label htmlFor="speech-language" style={{fontSize:12}}>
                                        Select Speech Recognition Language:
                                    </label>
                                    <select
                                        value={selectedLanguage}
                                        onChange={handleLanguageChange}
                                        style={{ marginBottom: '10px', padding: '5px', borderRadius: '5px' }}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                                        ))}
                                    </select>

                                    <textarea
                                        className="area"
                                        rows={12}
                                        placeholder={listening ? "Listening..." : "Add your Caption/Description here..."}
                                        value={caption}
                                        name="caption"
                                        onChange={handleCaptionChange}
                                        style={{
                                            width: '100%',
                                            border: '1px solid #ccc',
                                            borderRadius: '5px',
                                            resize: 'none',
                                            outline: 'none',
                                            paddingRight: '40px'
                                        }}
                                        id="textHere"
                                    />

                                    <IconButton
                                        onClick={handleListen}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            bottom: '45px',
                                            backgroundColor: listening ? 'red' : 'transparent',
                                            color: listening ? 'white' : 'black'
                                        }}
                                    >
                                        {listening ? <StopIcon /> : <MicIcon />}
                                    </IconButton>

                                    <span
                                        style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '10px',
                                            fontSize: '10px',
                                            color: caption.length === maxCaptionCharacters ? 'red' : '#666'
                                        }}
                                    >
                                        {caption.length}/{maxCaptionCharacters}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {fileType === 'image' && file && (
                                        <>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="File Preview"
                                                style={{
                                                    maxHeight: '300px',
                                                    maxWidth: '200px',
                                                    borderRadius: '10px',
                                                }}
                                            />

                                            <IconButton
                                                onClick={() => setFile(null)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    backgroundColor: 'white',
                                                    padding: '5px',
                                                }}
                                            >
                                                <CancelIcon style={{ color: 'black' }} />
                                            </IconButton>
                                        </>
                                    )}
                                    {fileType === 'video' && file && (
                                        <>
                                            <video controls className="file-preview" style={{
                                                maxHeight: '300px',
                                                maxWidth: '200px',
                                                borderRadius: '10px',
                                            }}>
                                                <source src={URL.createObjectURL(file)} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            <IconButton
                                                onClick={() => setFile(null)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    backgroundColor: 'white',
                                                    padding: '5px',
                                                }}
                                            >
                                                <CancelIcon style={{ color: 'black' }} />
                                            </IconButton>
                                        </>
                                    )}
                                </div>
                                <div>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap', position: 'relative' }}>
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <Tooltip title="Take Photo" placement="top">
                                                <IconButton onClick={handleCameraClick}>
                                                    <PhotoCameraIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Select Photo or Video" placement="top">
                                                <IconButton onClick={handleGalleryClick}>
                                                    <InsertPhotoIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <input
                                                id="fileInput"
                                                type="file"
                                                accept="image/, video/"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                                name="mediaFile"
                                            />
                                            {showCamera && (
                                                <div style={{
                                                    position: 'fixed',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    zIndex: 2
                                                }}>
                                                    <Webcam ref={webcamRef} style={{ width: '95%', height: '95%' }} />
                                                    <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 10 }}>
                                                        <IconButton onClick={handleCapture} style={{ color: 'white' }} name="mediaFile" >
                                                            <PhotoCameraIcon name="mediaFile" />
                                                        </IconButton>
                                                        <IconButton onClick={handleStartRecording} style={{ color: 'white' }} name="mediaFile">
                                                            <FaVideo name="mediaFile" />
                                                        </IconButton>
                                                        <IconButton onClick={() => setShowCamera(false)} style={{ color: 'white' }}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Tooltip TransitionComponent={Zoom} title="Add emojis" enterDelay={100} leaveDelay={100} placement="top-end">
                                            <IconButton>
                                                <MoodOutlinedIcon onClick={handleEmojiIconClick} />
                                                <Popover
                                                    open={Boolean(anchorEl)}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClosePopover}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'center',
                                                    }}
                                                >
                                                    <EmojiPicker onEmojiClick={addEmoji} />
                                                </Popover>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip TransitionComponent={Zoom} title="Add Location" enterDelay={100} leaveDelay={100} placement="top-end">
                                            <IconButton>
                                                <FmdGoodOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                            TransitionComponent={Zoom}
                                            title="Hashtag"
                                            enterDelay={100}
                                            leaveDelay={100}
                                            placement="top-end"
                                        >
                                            <IconButton onClick={handleIconClick}>
                                                <TagIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {showInput && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: "70%",
                                                    left: '25%',
                                                    transform: "translateY(-16px)",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "8px",
                                                    background: "#fff",
                                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                                    width: "300px",
                                                }}
                                            >
                                                <input
                                                    type="text"
                                                    value={query}
                                                    onChange={handleInputChange}
                                                    placeholder="Type to search hashtags"
                                                    style={{
                                                        padding: "10px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                        outline: "none",
                                                        fontSize: "14px",
                                                        width: '250px'
                                                    }}
                                                />
                                                <IconButton onClick={handleFetchClick} sx={{ position: 'relative', left: '6px' }}>
                                                    <SendIcon sx={{ color: 'blue' }} />
                                                </IconButton>
                                                <div
                                                    style={{
                                                        width: "300px",
                                                        height: "200px",
                                                        borderRadius: "4px",
                                                        overflowY: "auto",
                                                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                                                        border: "1px solid #ccc",
                                                        background: "#fff",
                                                        marginTop: "8px",
                                                    }}
                                                >
                                                    {Array.isArray(suggestions) && suggestions.length > 0 ? (
                                                        suggestions.map((hashtag, index) => (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    padding: "8px",
                                                                    cursor: "pointer",
                                                                    fontSize: "14px",
                                                                    borderBottom: "1px solid #f0f0f0",
                                                                }}
                                                                onClick={() => handleHashtagSelect(hashtag)}
                                                            >
                                                                {hashtag}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        noHashtagMessage && (
                                                            <div
                                                                style={{
                                                                    padding: "8px",
                                                                    textAlign: "center",
                                                                    fontSize: "14px",
                                                                    color: "#999",
                                                                    border: "1px solid #ccc",
                                                                    borderRadius: "4px",
                                                                    background: "#fff",
                                                                    marginTop: "8px",
                                                                }}
                                                            >
                                                                {noHashtagMessage}
                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                            </div>
                                        )}
                                        <Tooltip>
                                            <IconButton
                                                onClick={handleAIComponent}
                                                sx={{
                                                    margin: '20px',
                                                    padding: '8px 14px',
                                                    border: '2px solid',
                                                    borderColor: '#ba343b',
                                                    outline: 'none',
                                                    backgroundColor: 'transparent',
                                                    color: '#333',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    borderRadius: '12px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    zIndex: 0,
                                                    animation: 'blinker 2s ease-in-out infinite',
                                                    transition: 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
                                                    '&:hover': {
                                                        color: 'black',
                                                        backgroundColor: '#FF7300',
                                                        boxShadow: '0 0 10px rgba(255, 115, 0, 0.6)',
                                                        borderColor: '#ba343b',
                                                    },
                                                    '@keyframes blinker': {
                                                        '0%': { backgroundColor: 'transparent' },
                                                        '50%': { backgroundColor: '#FAFAD2' },
                                                        '100%': { backgroundColor: 'transparent' },
                                                    },
                                                }}
                                            >
                                                Compose with AI <AutoAwesomeIcon sx={{
                                                    fontSize: '16px',
                                                    marginLeft: '5px',
                                                    animation: 'iconBlinker 2s ease-in-out infinite',
                                                    '@keyframes iconBlinker': {
                                                        '0%, 100%': { color: 'white' },
                                                        '50%': { color: '#ba343b' },
                                                    },
                                                }} />
                                            </IconButton>
                                        </Tooltip>
                                        {AIopen && <QI onAiClose={handleAIClose} />}
                                        {mediaPlatform.includes('youtube') && (
                                            <FormControl sx={{ width: 242, maxWidth: '100%', marginTop: 2 }}>
                                                <InputLabel sx={{ mt: -0.5 }}>Who can see this?</InputLabel>
                                                <Select
                                                    value={visibility}
                                                    onChange={handleVisibilityChange}
                                                    label="Who can see this?"
                                                    sx={{ height: '45px' }}
                                                >
                                                    <MenuItem value="public">Public</MenuItem>
                                                    <MenuItem value="private">Private</MenuItem>
                                                    <MenuItem value="unlisted">Unlisted</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                        {mediaPlatform.includes('pinterest') && PinterestBoards.length > 0 && (
                                            <FormControl sx={{ width: 242, maxWidth: '100%', marginTop: 2 }}>
                                                <InputLabel sx={{ mt: -0.5 }}>Select a Pinterest Board</InputLabel>
                                                <Select
                                                    value={boardName}
                                                    onChange={handleBoardSelect}
                                                    label="Select a Pinterest Board"
                                                    sx={{ height: '45px' }}
                                                >
                                                    {PinterestBoards.map((boardName, index) => (
                                                        <MenuItem key={index} value={boardName}>
                                                            {boardName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Stack>
                                </div>
                            </div>
                        </Grid>
                        <Grid item lg={5} md={5} xs={12} sx={{ border: 1, borderStyle: 'ridge', display: 'flex', flexDirection: 'column' }}>
                            <div className="preview" style={{ padding: '8px' }}>
                                <h4 id="newPost">Media Preview</h4>
                            </div>
                            {mediaPlatform.map((mediaPlatforms) => {
                                const { profilePic: ProfileIcon, username, bgcolor } = platformData[mediaPlatforms] || {};
                                return (
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            maxWidth: 400,
                                            mb: 2,
                                            border: '0.1px solid #DFDFDF',
                                            color: 'black',
                                        }}
                                    >
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ bgcolor: bgcolor }}>
                                                    {ProfileIcon && <ProfileIcon />}
                                                </Avatar>
                                            }
                                            title={
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontSize: '15px', color: '#000' }}
                                                >
                                                    {username}
                                                </Typography>
                                            }
                                            subheader={
                                                mediaPlatforms === 'instagram' ? null : (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: '#b0b3b8', fontSize: '0.7rem' }}
                                                    >
                                                        Just now
                                                    </Typography>
                                                )
                                            }
                                            sx={{ color: '#e4e6eb' }}
                                            action={
                                                <IconButton sx={{ color: '#b0b3b8' }}>•••</IconButton>
                                            }
                                        />
                                        {mediaPlatforms === 'instagram' && (
                                            <>
                                                {file && fileType === 'image' && (
                                                    <CardMedia
                                                        component="img"
                                                        image={URL.createObjectURL(file)}
                                                        alt="Post image"
                                                        sx={{
                                                            width: '100%',
                                                            height: 'auto',
                                                        }}
                                                    />
                                                )}
                                                {file && fileType === 'video' && (
                                                    <CardMedia
                                                        component="video"
                                                        controls
                                                        src={URL.createObjectURL(file)}
                                                        alt="Post video"
                                                        sx={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            backgroundColor: 'black',
                                                        }}
                                                    />
                                                )}
                                                <CardActions
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <div>
                                                        <IconButton sx={{ color: 'gray' }}>
                                                            <FavoriteBorderOutlined />
                                                        </IconButton>
                                                        <IconButton sx={{ color: 'gray' }}>
                                                            <ChatBubbleOutline />
                                                        </IconButton>
                                                        <IconButton sx={{ color: 'gray' }}>
                                                            <SendOutlined />
                                                        </IconButton>
                                                    </div>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <BookmarkOutlined />
                                                    </IconButton>
                                                </CardActions>
                                                <CardContent>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            flexDirection: 'column',
                                                            wordWrap: 'break-word',
                                                            wordBreak: 'break-word',
                                                            letterSpacing: 'normal'
                                                        }}
                                                    >
                                                        <Typography>{username}</Typography>
                                                        {instaShowMore ? caption : `${caption.slice(0, maxLength)}`}
                                                        {caption.length > maxLength && (
                                                            <Button
                                                                onClick={toggleShowMore1}
                                                                sx={{
                                                                    padding: 0,
                                                                    minWidth: 0,
                                                                    color: '#0073e6',
                                                                    textTransform: 'none',
                                                                    fontSize: 'inherit',
                                                                }}
                                                            >
                                                                {instaShowMore ? " Show less" : " Show more"}
                                                            </Button>
                                                        )}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: '#b0b3b8', mt: 1 }}
                                                    >
                                                        Just now
                                                    </Typography>
                                                </CardContent>
                                            </>
                                        )}
                                        {(mediaPlatforms === 'facebook' || mediaPlatforms === 'LinkedIn') && (
                                            <>
                                                <CardContent>
                                                    <Typography
                                                        variant="body2"
                                                        style={{
                                                            wordWrap: 'break-word',
                                                            wordBreak: 'break-word',
                                                            letterSpacing: 'normal',
                                                        }}
                                                    >
                                                        {fbShowMore ? caption : `${caption.slice(0, maxLength)}`}
                                                        {caption.length > maxLength && (
                                                            <Button
                                                                onClick={toggleShowMore2}
                                                                sx={{
                                                                    padding: 0,
                                                                    minWidth: 0,
                                                                    color: '#0073e6',
                                                                    textTransform: 'none',
                                                                    fontSize: 'inherit',
                                                                }}
                                                            >
                                                                {fbShowMore ? ' Show less' : ' Show more'}
                                                            </Button>
                                                        )}
                                                    </Typography>
                                                </CardContent>
                                                {file && fileType === 'image' && (
                                                    <CardMedia component="img" image={URL.createObjectURL(file)} alt="Post image" />
                                                )}
                                                {file && fileType === 'video' && (
                                                    <CardMedia component="video" controls src={URL.createObjectURL(file)} alt="Post video" />
                                                )}
                                                <CardActions style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ThumbUpAltOutlined />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Like
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ChatBubbleOutline />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Comment
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ShareTwoTone />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Share
                                                        </Typography>
                                                    </IconButton>
                                                </CardActions>
                                            </>
                                        )}
                                        {mediaPlatforms === 'youtube' && (
                                            <>
                                                <CardContent>
                                                    <Typography variant="body2" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                                        {title}
                                                    </Typography>
                                                    <Typography variant="body2" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                                        {youtubeShowmore ? caption : `${caption.slice(0, maxLength)}`}
                                                        {caption.length > maxLength && (
                                                            <Button
                                                                onClick={toggleShowMore4}
                                                                sx={{
                                                                    padding: 0,
                                                                    minWidth: 0,
                                                                    color: '#0073e6',
                                                                    textTransform: 'none',
                                                                    fontSize: 'inherit',
                                                                }}
                                                            >
                                                                {youtubeShowmore ? " Show less" : " Show more"}
                                                            </Button>
                                                        )}
                                                    </Typography>

                                                </CardContent>
                                                {file && fileType === 'video' && (
                                                    <CardMedia
                                                        component="iframe"
                                                        src={URL.createObjectURL(file)}
                                                        title="YouTube Video"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        sx={{ width: '100%', height: 'auto' }}
                                                    />
                                                )}
                                                {/* <CardActions style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ThumbUpAltOutlined />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Like
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ThumbDownAltOutlined />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Dislike
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ChatBubbleOutline />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Comment
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ShareTwoTone />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Share
                                                        </Typography>
                                                    </IconButton>
                                                </CardActions> */}
                                            </>
                                        )}

                                        {mediaPlatforms === 'Reddit' && (
                                            <>
                                                <CardContent>
                                                    <Typography variant="body2" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                                        {redditShowmore ? caption : `${caption.slice(0, maxLength)}`}
                                                        {caption.length > maxLength && (
                                                            <Button
                                                                onClick={toggleShowMore3}
                                                                sx={{
                                                                    padding: 0,
                                                                    minWidth: 0,
                                                                    color: '#0073e6',
                                                                    textTransform: 'none',
                                                                    fontSize: 'inherit',
                                                                }}
                                                            >
                                                                {redditShowmore ? " Show less" : " Show more"}
                                                            </Button>
                                                        )}
                                                    </Typography>
                                                </CardContent>
                                                {file && fileType === 'image' && (
                                                    <CardMedia component="img" image={URL.createObjectURL(file)} alt="Post image" />
                                                )}
                                                {file && fileType === 'video' && (
                                                    <CardMedia component="video" controls src={URL.createObjectURL(file)} alt="Post video" />
                                                )}
                                                <CardActions style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ArrowUpward />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Upvote
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ArrowDownward />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Downvote
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ChatBubbleOutline />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Comment
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ShareTwoTone />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Share
                                                        </Typography>
                                                    </IconButton>
                                                </CardActions>
                                            </>
                                        )}

                                        {mediaPlatforms === 'pinterest' && (
                                            <>
                                                <CardContent>
                                                    <Typography variant="body2" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                                        {redditShowmore ? caption : `${caption.slice(0, maxLength)}`}
                                                        {caption.length > maxLength && (
                                                            <Button
                                                                onClick={toggleShowMore3}
                                                                sx={{
                                                                    padding: 0,
                                                                    minWidth: 0,
                                                                    color: '#0073e6',
                                                                    textTransform: 'none',
                                                                    fontSize: 'inherit',
                                                                }}
                                                            >
                                                                {redditShowmore ? " Show less" : " Show more"}
                                                            </Button>
                                                        )}
                                                    </Typography>
                                                </CardContent>
                                                {file && fileType === 'image' && (
                                                    <CardMedia component="img" image={URL.createObjectURL(file)} alt="Post image" />
                                                )}


                                            </>
                                        )}

                                        {mediaPlatforms === 'Telegram' && (
                                            <>
                                                <CardContent>
                                                    <Typography variant="body2" style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                                                        {caption}
                                                    </Typography>
                                                </CardContent>
                                                {file && fileType === 'image' && (
                                                    <CardMedia component="img" image={URL.createObjectURL(file)} alt="Post image" />
                                                )}
                                                <CardActions style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <Chat />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Reply
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <ShareTwoTone />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Forward
                                                        </Typography>
                                                    </IconButton>
                                                    <IconButton sx={{ color: 'gray' }}>
                                                        <BookmarkOutlined />
                                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                                            Save
                                                        </Typography>
                                                    </IconButton>
                                                </CardActions>
                                            </>
                                        )}
                                    </Card>
                                );
                            })}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className="action">
                    <div style={{ display: 'flex' }}>
                        {warningMessages.length > 0 && (
                            <div style={{ display: 'flex' }}>
                                <Tooltip
                                    title={
                                        <ul style={{ paddingLeft: '10px', margin: '0' }}>
                                            {warningMessages.map((message, index) => (
                                                <li key={index} style={{ fontSize: '12px' }}>
                                                    {message}
                                                </li>
                                            ))}
                                        </ul>
                                    }
                                    arrow
                                    enterDelay={300}
                                    leaveDelay={100}
                                    placement="top"
                                >
                                    <WarningIcon style={{ color: 'red', cursor: 'pointer', marginTop: '5px' }} />
                                </Tooltip>
                                <span style={{ color: 'red', fontSize: '12px', marginLeft: '5px' }}></span>
                            </div>
                        )}
                        <Button onClick={handleConfirmCloseOpen} color="error">Cancel</Button>
                        <Button variant="contained" disabled={shareButtonDisabled} endIcon={<SendIcon />} onClick={handleClickOpen} sx={{ borderRadius: '20px' }}>Share</Button>
                        <Dialog open={open1} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth>
                            <DialogContent>
                                <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>Are you sure you want to Post?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} style={{ color: '#ba343b' }}>Cancel</Button>
                                <Button onClick={handleSubmit} style={{ color: '#ba343b' }} autoFocus>Yes</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </DialogActions>
            </Dialog>
            <ToastContainer />
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

export default Post;  