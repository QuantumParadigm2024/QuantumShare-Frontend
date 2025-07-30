/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom"
import Paper from '@mui/material/Paper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../Helper/AxiosInstance';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FetchUser } from '../Redux/FetchUser';
import QS from '../Assets/QS.webp';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { TailSpin } from 'react-loader-spinner';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const defaultTheme = createTheme({
    typography: {
        h1: {
            fontWeight: 700,
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '1rem',
        },
    },
});

const Login = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        emph: '',
        password: '',
        confirm_password: '',
        rememberMe: false,
    });
    const { emph, password, confirm_password } = formData;
    const [isOpen, setIsOpen] = useState(true);
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation('');

    const handleCloseSignUp = () => {
        setIsOpen(false);
        navigate("/")
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!emph || !password) {
            setError('Please enter your email & password');
            return;
        }
        setError('');

        const params = {
            emph: formData.emph,
            password: formData.password,
        };
        const endpoint = '/quantum-share/user/login';
        try {
            const response = await axiosInstance.post(endpoint, formData, {
                headers: {
                    'Accept': 'application/json',
                },
                params: params,
            });
            const encryptedToken = CryptoJS.AES.encrypt(response.data.data, secretKey).toString();
            localStorage.setItem('qs', encryptedToken);
            navigate('/dashboard');
            await FetchUser(dispatch)
        } catch (error) {
            console.error('Error submitting:', error);
            const errorCode = error.response?.data?.code;
            const errorMessage = error.response?.data?.message;
            const email = error.response?.data?.data;

            if (errorCode === 120) {
                navigate('/regenerate-password', { state: { email } });
            } else if (errorCode === 121) {
                localStorage.removeItem("qs")
                navigate('/session');
            }
            else {
                toast.error(errorMessage || 'An error occurred');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    const [isMuted, setIsMuted] = useState(true);
    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const EndAdornment = ({ visible, setVisible }) => {
        return (
            <InputAdornment position='end'>
                <IconButton onClick={() => setVisible(!visible)}>
                    {visible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </IconButton>
            </InputAdornment>
        )
    }

    const [userDetails, setUserDetails] = useState({ email: '', firstName: '', lastName: '', profilePic: '' });

    const checkEmailExistence = async (email) => {
        try {
            const endpoint = `/quantum-share/user/google/verify/email?email=${email}`;
            const response = await axiosInstance.get(endpoint, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status === 'success' && response.data.message === 'Account already exists with this email') {
                return { exists: true, passwordNull: false, token: response.data.data };
            }
            return { exists: false, passwordNull: false, token: null };
        } catch (error) {
            if (error.response && error.response.data.status === 'error' && error.response.data.message === 'Password null') {
                return { exists: true, passwordNull: true, email: error.response.data.data };
            } else if (error.response.data.code === 121) {
                localStorage.removeItem("qs")
                navigate('/session');
            }
            console.error('Error verifying email:', error);
            toast.error('Error checking email existence.');
            return { exists: false, passwordNull: false, token: null };
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse?.credential);
            console.log('Decoded JWT:', decoded);

            const { exists, passwordNull, token, email } = await checkEmailExistence(decoded.email);
            console.log('Email existence check:', { exists, passwordNull, token });

            if (exists) {
                if (passwordNull) {
                    navigate('/regenerate-password', { state: { email: decoded.email } });
                } else {
                    if (token) {
                        console.log('Tokennnn : ', token)
                        const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
                        localStorage.setItem('qs', encryptedToken);
                        navigate('/dashboard');
                    } else {
                        console.error('Token is null. Cannot store in localStorage.');
                        toast.error('Unexpected error: Token is missing.');
                    }
                }
                return;
            }
            setUserDetails({
                email: decoded.email,
                firstName: decoded.given_name,
                lastName: decoded.family_name,
                profilePic: decoded.picture,
            });
            setOpen(true);
        } catch (error) {
            console.error('Google Login Error:', error);
            toast.error('Error signing in with Google.');
        }
    };

    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\])[A-Za-z\d!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleGoogleSubmit = async () => {
        setLoading(true);
        setErrors({});

        if (!isPasswordValid(password)) {
            setErrors({ password: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character' });
            setLoading(false);
            return;
        }

        if (password !== confirm_password) {
            setErrors({ confirm_password: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const formData = {
                email: userDetails.email,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                profilePic: userDetails.profilePic,
                password: password,
            };
            console.log('FormData', formData)
            const endpoint = '/quantum-share/user/login/google/authentication';
            const response = await axiosInstance.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const encryptedToken = CryptoJS.AES.encrypt(response.data.data, secretKey).toString();
            localStorage.setItem('qs', encryptedToken);
            setOpen(false);
            navigate('/dashboard');
            await FetchUser(dispatch);
        } catch (error) {
            if (error) {
                toast.error('Error signing in with Google.');
            }
            else if (error.response.data.code === 121) {
                localStorage.removeItem("qs")
                navigate('/session');
            }
            console.error('Google Login Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                {isOpen && (
                    <Grid container component="main" sx={{ height: '100vh' }}>
                        <CssBaseline />
                        <Grid item xs={false} sm={false} md={7} sx={{
                            display: { xs: 'none', sm: 'none', md: 'block' },
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900], position: 'relative'
                        }}>
                            <video autoPlay loop muted={isMuted} style={{ width: '100%', height: '100%' }} src="https://quantumshare.quantumparadigm.in/vedio/QP%20ADD%20VDIEO%202024.mp4"></video>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <img src={QS} alt="" style={{ position: 'absolute', top: '20px', left: '15px', height: 30 }} />
                                <IconButton onClick={toggleMute} style={{ position: 'absolute', top: '10px', right: '5px', color: '#BA343B' }}>
                                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
                            <Box
                                sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                <CloseOutlinedIcon style={{
                                    position: 'absolute', top: 0, right: 0,
                                    fontSize: 30, color: '#ba343b', cursor: 'pointer',
                                }}
                                    onClick={handleCloseSignUp} />
                                <Avatar sx={{ mt: -4, bgcolor: '#ba343b' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h6" sx={{ mt: 1 }}>
                                    {t('login')}
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} >
                                    <Grid container spacing={0} justifyContent="center">
                                        {error && (
                                            <Typography color="error" variant="body2" sx={{ mt: 1, fontSize: '12px' }}>
                                                {error}
                                            </Typography>
                                        )}
                                        <Grid item xs={10}>
                                            <TextField margin="normal" required fullWidth id="emph" label={t('email/Pnum')} name="emph" value={emph} onChange={handleChange} error={!!errors.emph} helperText={errors.emph} autoFocus />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <TextField margin="normal" required fullWidth name="password" label={t('password')} type={passwordVisible ? 'text' : 'password'} id="password" value={password} onChange={handleChange} error={!!errors.password} helperText={errors.password} autoComplete="current-password"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={togglePasswordVisibility}>
                                                                {passwordVisible ? <VisibilityOutlinedIcon /> : < VisibilityOffOutlinedIcon />} </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }} />
                                        </Grid>
                                        <Grid item xs={10} sx={{ textAlign: 'right' }}>
                                            <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#1976db', fontSize: 15 }}>
                                                {t('forgotPassword')}
                                            </Link>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Button type="submit" fullWidth variant="contained"
                                                sx={{
                                                    mb: 1, height: '50px', marginTop: '20px', fontSize: '18px', bgcolor: '#ba343b',
                                                    '&:hover': { bgcolor: '#9e2b31' }
                                                }}> {t('login')}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography sx={{ fontSize: '12px', textAlign: 'center' }}>
                                                By signing up, you agree to the <Link to='/privacy-policy' style={{ textDecoration: 'none', color: '#1976db' }}>Privacy Policy</Link> of Quantum Share.
                                            </Typography>
                                        </Grid>
                                        <Box sx={{ width: 'fit-content', margin: '25px auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <GoogleLogin
                                                onSuccess={handleGoogleLoginSuccess}
                                                onError={() => {
                                                    console.log('Login Failed');
                                                }}
                                                style={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Grid item>
                                            <div style={{ marginTop: '10px' }}>
                                                <Link to="/signUp">
                                                    <div variant="body2" style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}>
                                                        {t('noAccount')}{' '}
                                                        <span style={{ color: '#1976db' }}>{t('signUp')}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                )}
                <ToastContainer />
            </ThemeProvider>
            <Dialog open={open} fullWidth maxWidth="sm" sx={{ height: '100%' }}>
                <DialogContent sx={{ height: '100%' }}>
                    <Typography
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <img src={QS} alt="" style={{ height: 35, marginTop: '5px' }} />
                    </Typography>
                    <DialogTitle sx={{ m: 0, p: 2, color: '#ba343b', fontSize: '20px', textAlign: 'center' }}>
                        {t('setPassword')}
                    </DialogTitle>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={11}>
                                <TextField required fullWidth name="password" label="Password" type={passwordVisible ? 'text' : 'password'} id="password" autoComplete="new-password" value={password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        sx: {
                                            height: '50px',
                                            padding: '0 10px',
                                        },
                                        endAdornment: (
                                            <EndAdornment
                                                visible={passwordVisible}
                                                setVisible={handleTogglePasswordVisibility}
                                            />)
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: '14px',
                                        },
                                    }} />
                            </Grid>
                            <Grid item xs={11}>
                                <TextField required fullWidth name="confirm_password" label="Confirm Password" type={confirmPasswordVisible ? 'text' : 'password'} id="confirm_password" autoComplete="new-password" value={confirm_password}
                                    onChange={handleChange}
                                    error={!!errors.confirm_password}
                                    helperText={errors.confirm_password}
                                    InputProps={{
                                        sx: {
                                            height: '50px',
                                            padding: '0 10px',
                                        },
                                        endAdornment: (
                                            <EndAdornment
                                                visible={confirmPasswordVisible}
                                                setVisible={handleToggleConfirmPasswordVisibility}
                                            />)
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: '14px',
                                        },
                                    }} />
                            </Grid>
                            <Grid item xs={11}>
                                <Button fullWidth variant="contained" onClick={handleGoogleSubmit} sx={{ bgcolor: '#ba343b', color: 'white', height: 50, fontSize: 16, '&:hover': { bgcolor: '#9e2b31' }, mt: 15, '&:disabled': { bgcolor: '#e0e0e0', color: '#a0a0a0', } }}
                                    disabled={!password || !confirm_password || loading}
                                >
                                    {loading ? <TailSpin color="#ba343b" height={25} width={25} /> : 'Submit'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Login;