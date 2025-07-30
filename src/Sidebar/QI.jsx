/* eslint-disable jsx-a11y/img-redundant-alt */
// /* eslint-disable no-unused-vars */
// import React, { useState, useContext } from 'react';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import DownloadIcon from '@mui/icons-material/Download';
// import Grid from '@mui/material/Grid';
// import axiosInstance from '../Helper/AxiosInstance';
// import { Tooltip, CircularProgress, IconButton } from '@mui/material';
// import { RingLoader } from 'react-spinners';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import Zoom from '@mui/material/Zoom';
// import DoneIcon from '@mui/icons-material/Done';
// import Quantum from '../Assets/Quantum_Logo.webp'
// import { ImageContext } from '../Context/ImageContext';
// import { useDispatch } from 'react-redux';
// import { setAiText } from '../Redux/action/AiTextSlice';
// import { useTranslation } from 'react-i18next';

// const QI = ({ onAiClose }) => {
//     var url = "";
//     const [input, setInput] = useState('');
//     const [aiopen, setAiOpen] = useState(false);
//     const [inputText, setInputText] = useState('');
//     const [imageSrc, setImageSrc] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [textResponse, setTextResponse] = useState('');
//     const { setImage1 } = useContext(ImageContext);
//     const dispatch = useDispatch()
//     const { t } = useTranslation('');

//     const handleTextSubmit = async () => {
//         const endpoint = '/quantum-share/aitext';
//         const formData = new FormData();
//         formData.append('userMessage', inputText);
//         try {
//             setLoading(true)
//             const response = await axiosInstance.post(endpoint, formData, {
//                 headers: {
//                     'Accept': 'application/json'
//                 }
//             })
//             console.log(response.data)
//             var res = response.data;
//             var data = res['data'];
//             console.log(res)
//             setTextResponse(data)
//         } catch (error) {
//             console.log('Error fetching response:', error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     // const handleSubmit = () => {
//     //     setAiOpen(true)
//     // }

// const handleSubmit = async () => {
//     try {
//         setLoading(true)
//         const formData = new FormData();
//         formData.append('textPromt', input);

//         const endpoint = "/quantum-share/generate-image";
//         const response = await axiosInstance.post(endpoint, formData, {
//             responseType: 'arraybuffer',
//             headers: {
//                 'Accept': 'application/json',
//             },
//         });
//         console.log(response);
//         const blob = new Blob([response.data], { type: 'image/png' });
//         console.log(blob);
//         const imageUrl = URL.createObjectURL(blob);
//         url = imageUrl;
//         console.log(url);
//         console.log(imageUrl);
//         setImageSrc(imageUrl);
//         setError('');
//     } catch (error) {
//         console.error(error);
//         if (error.response && error.response.data && error.response.data.message) {
//             setError(error.response.data.message);
//         } else { setError('Error generating image'); }
//     } finally { setLoading(false); }
// }

//     const [copied, setCopied] = useState(false);

//     const copyTextToClipboard = () => {
//         navigator.clipboard.writeText(textResponse)
//             .then(() => {
//                 console.log('Text copied to clipboard'); setCopied(true); setTimeout(() => setCopied(false), 2000)
//             }).catch((error) => { console.error('Failed to copy text: ', error); })
//     }

//     const handleDownload = () => { if (!imageSrc) return; const link = document.createElement('a'); link.href = imageSrc; link.download = 'generated_image.png'; link.click() }
//     const handleSend = () => { dispatch(setAiText(textResponse)); setImage1(imageSrc); onAiClose(false) }
//     const handleClose = () => { setAiOpen(false) }

//     return (
//         <>
//             <Dialog fullWidth maxWidth="md" open={true} onClose={onAiClose} PaperProps={{ component: 'form', onSubmit: (event) => { event.preventDefault(); handleSubmit(); }, sx: { padding: '10px', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: '100%', } }}>
//                 <DialogTitle sx={{ display: 'flex' }}>
//                     <div>{t('shareWithQuantumAI')} <AutoAwesomeIcon /></div>
//                 </DialogTitle>
//                 <Grid container spacing={3} sx={{ flexGrow: 1, overflowY: 'auto' }}>
//                     <Grid item xs={12} md={6} sx={{ borderRight: '0.5px solid #ccc', paddingRight: '15px' }}>
//                         <DialogTitle>{t('usingQuantumAI')}</DialogTitle>
//                         <DialogContent sx={{ marginTop: '10px' }}>
//                             <TextField
//                                 autoFocus
//                                 margin="dense"
//                                 name="userMessage"
//                                 label={t('enterTextHere')}
//                                 type="text"
//                                 variant="outlined"
//                                 value={inputText}
//                                 fullWidth
//                                 sx={{ marginBottom: '20px' }}
//                                 onChange={(e) => setInputText(e.target.value)}
//                             />
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleTextSubmit}
//                                 disabled={!inputText || loading}
//                                 fullWidth
//                                 sx={{ mt: 2 }}
//                             >
//                                 {t('generate')} &nbsp;<AutoFixHighIcon />
//                             </Button>
//                         </DialogContent>
//                         <DialogContent sx={{ marginTop: '30px' }}>
//                             <TextField
//                                 margin="none"
//                                 name="textPrompt"
//                                 label={t('generateImage')}
//                                 type="text"
//                                 variant="outlined"
//                                 fullWidth
//                                 sx={{ marginBottom: '20px' }}
//                                 value={input}
//                                 onChange={(e) => setInput(e.target.value)}
//                             />
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={handleSubmit}
//                                 disabled={!input || loading}
//                                 fullWidth
//                                 sx={{ mt: 1 }}
//                             >
//                                 {t('generate')} &nbsp;<AutoAwesomeIcon />
//                             </Button>
//                             <TextField autoFocus margin="dense" name="userMessage" label="Enter text here" type="text" variant="outlined" value={inputText} fullWidth sx={{ marginBottom: '20px' }} onChange={(e) => setInputText(e.target.value)} />
//                             <Button variant="contained" color="primary" onClick={handleTextSubmit} disabled={!inputText || loading} fullWidth sx={{ mt: 2 }}>
//                                 Generate &nbsp;<AutoFixHighIcon />
//                             </Button>
//                         </DialogContent>
//                         <DialogContent sx={{ marginTop: '30px' }}>
//                             <TextField margin="none" name="textPrompt" label="Generate image" type="text" variant="outlined" fullWidth sx={{ marginBottom: '20px' }} value={input} onChange={(e) => setInput(e.target.value)} />
//                             <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!input || loading} fullWidth sx={{ mt: 1 }}>Generate &nbsp;<AutoAwesomeIcon /> </Button>
//                             <Dialog open={aiopen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth>
//                                 <DialogContent>
//                                     <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>{t('imageGenerationNotFreeTrial')}</DialogContentText>
//                                 </DialogContent>
//                                 <DialogActions>
//                                     <Button onClick={handleClose} style={{ color: '#ba343b' }}>{t('cancel')}</Button>
//                                     <Button onClick={handleClose} style={{ color: '#ba343b' }} autoFocus>{t('ok')}</Button>
//                                 </DialogActions>
//                             </Dialog>
//                         </DialogContent>
//                     </Grid>
//                     <Grid item xs={12} md={6} sx={{ paddingLeft: '15px' }}>
//                         <DialogTitle>{t('preview')}</DialogTitle>
//                         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//                             {loading ? (
//                                 <RingLoader color="#d3040c" loading={loading} size={50} aria-label="Loading Spinner" data-testid="loader" />) : (
//                                 <>{imageSrc && (
//                                     <div style={{ position: 'relative', display: 'inline-block' }}>
//                                         <img src={imageSrc} alt="Generated Image" style={{ maxWidth: '100%', borderRadius: '8px' }} />
//                                         <IconButton onClick={handleDownload} sx={{ position: 'absolute', top: '10px', right: '10px' }}>
//                                             <Tooltip title="Download image" placement="top" TransitionComponent={Zoom}>
//                                                 <DownloadIcon style={{ backgroundColor: '#596259', borderRadius: '50%', padding: '5px', color: 'white', fontSize: '30px', }} />
//                                             </Tooltip>
//                                         </IconButton>
//                                     </div>)} </>)}
//                         </div>
//                         <div style={{ marginTop: '20px', padding: '10px', fontFamily: 'sans-serif', wordWrap: 'break-word', position: 'relative', whiteSpace: 'pre-line' }}>
//                             {textResponse && (
//                                 <><div>{textResponse}</div>
//                                     <IconButton variant="standard" onClick={copyTextToClipboard} sx={{ position: 'absolute', right: 0, top: -30, display: { xs: 'flex', } }}>
//                                         <Tooltip title="Copy" placement="top" TransitionComponent={Zoom}>{copied ? <DoneIcon /> : <ContentCopyIcon sx={{ color: 'grey' }} />}</Tooltip>
//                                     </IconButton> </>)}
//                         </div>
//                         {error && <div style={{ color: 'red' }}>{error}</div>}
//                     </Grid>
//                 </Grid>
//                 <DialogActions sx={{ marginTop: 'auto', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', padding: '10px 24px', }}>
//                     <h6 style={{ color: 'grey' }}>
//                         {t('poweredBy')} <img src={Quantum} alt="Quantum Logo" height={30} style={{ marginLeft: '5px' }} /> {t('quantumParadigm')}
//                     </h6>
//                     <DialogActions>
//                         <Button onClick={onAiClose} variant="outlined" sx={{ mr: 2 }}>
//                             {t('cancel')}
//                         </Button>
//                         <Button onClick={handleSend} variant="contained" color="primary">
//                             {t('addToPost')}
//                         </Button>
//                         <Button onClick={onAiClose} variant="outlined" sx={{ mr: 2 }}>Cancel </Button>
//                         <Button onClick={handleSend} variant="contained" color="primary">Add to Post</Button>
//                     </DialogActions>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// }

// export default QI;



/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import Grid from '@mui/material/Grid';
import axiosInstance from '../Helper/AxiosInstance';
import { Tooltip } from '@mui/material';
import { RingLoader } from 'react-spinners';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Zoom from '@mui/material/Zoom';
import DoneIcon from '@mui/icons-material/Done';
import Quantum from '../Assets/Quantum_Logo.webp'
import { ImageContext } from '../Context/ImageContext';
import { useDispatch, useSelector } from 'react-redux';
import { setAiText } from '../Redux/action/AiTextSlice';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { FetchUser } from '../Redux/FetchUser';

const QI = ({ onAiClose }) => {
    var url = "";
    const { remainingDays, trail, subscription } = useSelector((state) => state.data);
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch()
    const [input, setInput] = useState('');
    const [aiopen, setAiOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [textResponse, setTextResponse] = useState('');
    const { setImage1 } = useContext(ImageContext);
    const [isSessionExpired, setIsSessionExpired] = useState(false);

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
        onAiClose(false);
    }

    const handleTextSubmit = async () => {
        const endpoint = '/quantum-share/aitext';
        const formData = new FormData();
        formData.append('userMessage', inputText);
        try {
            setLoading(true)
            const response = await axiosInstance.post(endpoint, formData, {
                headers: {
                    'Accept': 'application/json'
                }
            })
            console.log(response.data)
            var res = response.data;
            var data = res['data'];
            console.log(res)
            setTextResponse(data)
        } catch (error) {
            console.log('Error fetching response:', error);
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            }
        } finally {
            setLoading(false);
        }
    }

    // const handleSubmit = () => {
    //     setAiOpen(true)
    // }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('textPromt', input);

            const endpoint = "/quantum-share/generate-image";
            const response = await axiosInstance.post(endpoint, formData, {
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/json',
                },
            });
            console.log(response);
            const blob = new Blob([response.data], { type: 'image/png' });
            console.log(blob);
            const imageUrl = URL.createObjectURL(blob);
            url = imageUrl;
            console.log(url);
            console.log(imageUrl);
            setImageSrc(imageUrl);
            setError('');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else { setError('Error generating image'); }
        } finally { setLoading(false); }
    }
    const [copied, setCopied] = useState(false);
    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(textResponse)
            .then(() => {
                console.log('Text copied to clipboard');
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
            .catch((error) => {
                console.error('Failed to copy text: ', error);
            })
    }

    const handleDownload = () => {
        if (!imageSrc) return
        const link = document.createElement('a')
        link.href = imageSrc
        link.download = 'generated_image.png'
        link.click()
    }

    const handleSend = () => {
        dispatch(setAiText(textResponse))
        onAiClose(false)
    }

    const handleClose = () => {
        setAiOpen(false)
    }

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
            <Dialog
                fullWidth
                maxWidth="md"
                open={true}
                onClose={onAiClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleSubmit();
                    },
                    sx: {
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex' }}>
                    <div>Share with Quantum AI <AutoAwesomeIcon /></div>
                </DialogTitle>

                <Grid container spacing={3} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Grid item xs={12} md={6} sx={{ borderRight: '0.5px solid #ccc', paddingRight: '15px' }}>
                        <DialogTitle>Now you are using Quantum share's Quantum AI</DialogTitle>
                        <DialogContent sx={{ marginTop: '10px' }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="userMessage"
                                label="Enter text here"
                                type="text"
                                variant="outlined"
                                value={inputText}
                                fullWidth
                                sx={{ marginBottom: '20px' }}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleTextSubmit}
                                disabled={!inputText || loading}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Generate &nbsp;<AutoFixHighIcon />
                            </Button>
                        </DialogContent>
                        <DialogContent sx={{ marginTop: '30px' }}>
                            <TextField
                                margin="none"
                                name="textPrompt"
                                label="Generate image"
                                type="text"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '20px' }}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={!input || loading}
                                fullWidth
                                sx={{ mt: 1 }}
                            >
                                Generate &nbsp;<AutoAwesomeIcon />
                            </Button>
                            {/* <Dialog open={aiopen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth>
                                <DialogContent>
                                    <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>Image generation is not for Free Trial</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} style={{ color: '#ba343b' }}>Cancel</Button>
                                    <Button onClick={handleClose} style={{ color: '#ba343b' }} autoFocus>Ok</Button>
                                </DialogActions>
                            </Dialog> */}
                        </DialogContent>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ paddingLeft: '15px' }}>
                        <DialogTitle>Preview</DialogTitle>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            {loading ? (
                                <RingLoader
                                    color="#d3040c"
                                    loading={loading}
                                    size={50}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            ) : (
                                <>
                                    {imageSrc && (
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <img
                                                src={imageSrc}
                                                alt="Generated Image"
                                                style={{ maxWidth: '100%', borderRadius: '8px' }}
                                            />
                                            <IconButton
                                                onClick={handleDownload}
                                                sx={{ position: 'absolute', top: '10px', right: '10px' }}
                                            >
                                                <Tooltip title="Download image" placement="top" TransitionComponent={Zoom}>
                                                    <DownloadIcon
                                                        style={{
                                                            backgroundColor: '#596259',
                                                            borderRadius: '50%',
                                                            padding: '5px',
                                                            color: 'white',
                                                            fontSize: '30px',
                                                        }}
                                                    />
                                                </Tooltip>
                                            </IconButton>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div style={{ marginTop: '20px', padding: '10px', fontFamily: 'sans-serif', wordWrap: 'break-word', position: 'relative', whiteSpace: 'pre-line' }}>
                            {textResponse && (
                                <>
                                    <div>{textResponse}</div>
                                    <IconButton
                                        variant="standard"
                                        onClick={copyTextToClipboard}
                                        sx={{
                                            position: 'absolute',
                                            right: 0,
                                            top: -30,
                                            display: { xs: 'flex', }
                                        }}
                                    >
                                        <Tooltip title="Copy" placement="top" TransitionComponent={Zoom}>
                                            {copied ? <DoneIcon /> : <ContentCopyIcon sx={{ color: 'grey' }} />}
                                        </Tooltip>
                                    </IconButton>
                                </>
                            )}
                        </div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                    </Grid>
                </Grid>
                <DialogActions sx={{
                    marginTop: 'auto',
                    borderTop: '1px solid #ccc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 24px',
                }}>
                    <h6 style={{ color: 'grey' }}>
                        Powered by <img src={Quantum} alt="Quantum Logo" height={30} style={{ marginLeft: '5px' }} /> Quantum Paradigm
                    </h6>
                    <DialogActions>
                        <Button onClick={onAiClose} variant="outlined" sx={{ mr: 2 }}>
                            Cancel
                        </Button>
                        <Button onClick={handleSend} variant="contained" color="primary">
                            Add to Post
                        </Button>
                    </DialogActions>
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
        </>
    );
}

export default QI;