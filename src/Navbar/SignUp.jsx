/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { IconButton, InputAdornment } from '@mui/material';
import axiosInstance from '../Helper/AxiosInstance';
import { useNavigate } from "react-router-dom";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { FetchUser } from '../Redux/FetchUser';
import { useDispatch } from 'react-redux';
import QS from '../Assets/QS.webp';
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

const SignUp = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phoneNo: '', password: '', confirm_password: '', company: '' });
    const [errors, setErrors] = useState([])
    const [signupOpen, setsignupOpen] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const { firstName, lastName, email, phoneNo, password, confirm_password, company } = formData
    const {t} = useTranslation('');
    const handleCloseSignUp = () => {
        setsignupOpen(false);
        navigate("/")
    };

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        if (name === 'phoneNo' && !isNaN(value)) {
            setFormData({
                ...formData, [name]: value
            });
        } else {
            setFormData({
                ...formData, [name]: value
            });
        }
    };

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};
        const nameRegex = /^[A-Za-z\s]+$/; 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const phoneRegex = /^\d{10}$/; 

        if (!formData || formData.firstName.trim() === '') {
            newErrors.firstName = 'First name is required';
        } else if (!nameRegex.test(formData.firstName.trim())) {
            newErrors.firstName = 'First name should contain only alphabets';
        }

        if (!formData || formData.lastName.trim() === '') {
            newErrors.lastName = 'Last name is required';
        } else if (!nameRegex.test(formData.lastName.trim())) {
            newErrors.lastName = 'Last name should contain only alphabets';
        }

        if (!formData || formData.email.trim() === '') {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData || formData.phoneNo.trim() === '') {
            newErrors.phoneNo = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phoneNo.trim())) {
            newErrors.phoneNo = 'Please enter a valid 10-digit phone number';
        }

        if (!formData || formData.password.trim() === '') {
            newErrors.password = 'Password is required';
        } else if (!isPasswordValid(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character';
        }

        if (!formData || formData.confirm_password.trim() === '') {
            newErrors.confirm_password = 'Confirm Password is required';
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const loadingToast = toast.loading("Signing Up..........");

            let payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNo: formData.phoneNo,
                password: formData.password,
                company: formData.company
            };

            const endpoint = '/quantum-share/user/signup';
            try {
                const response = await axiosInstance.post(endpoint, payload, {
                    headers: {
                        'Accept': 'application/json',
                        'method': 'POST'
                    }
                });
                toast.success("Successfully signed up, please verify your email.");
                toast.dismiss(loadingToast);
                navigate("/verify");
            } catch (error) {
                console.error('Error submitting:', error);
                toast.dismiss(loadingToast);
                if (error.response) {
                    const status = error.response.status;
                    if (status === 406) {
                        console.log("Account already exists.");
                        toast.error("Account already exists.");
                    } else if (status === 500) {
                        console.log("Mail server connection failed. Please check your internet connection.");
                        toast.error("Mail server connection failed. Please check your internet connection.");
                    }else if (error.response.data.code === 121) {
                        localStorage.removeItem('qs')
                        navigate('/session'); 
                    }
                }
            }
        }
    }

    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\])[A-Za-z\d!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\]{8,}$/;
        return passwordRegex.test(password);
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

    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

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
            }else if (error.response.data.code === 121) {
                localStorage.removeItem('qs')
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
            toast.error('Error signing in with Google.');
            console.error('Google Login Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                {signupOpen && (
                    <Grid container component="main" sx={{ height: '100vh' }}>
                        <CssBaseline />
                        <Grid item xs={false} sm={false} md={7} sx={{
                            display: { xs: 'none', sm: 'none', md:'block'},
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
                        <Grid item xs={12} sm={12} md={5} component={Paper} square>
                            <Box
                                sx={{ my: -0.5, mx: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CloseOutlinedIcon style={{
                                    position: 'absolute', top: 0, right: 0,
                                    fontSize: 30, color: '#ba343b', cursor: 'pointer',
                                }}
                                    onClick={handleCloseSignUp} />
                                <Avatar sx={{ m: 1, bgcolor: '#ba343b' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h6">{t('signUp')}</Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                    <Grid container spacing={1} justifyContent="center">
                                        <Grid item xs={10} sm={5}>
                                            <TextField autoComplete="given-name" name="firstName" required fullWidth id="firstName" label={t('firstName')} autoFocus value={firstName}
                                                onChange={handleChange}
                                                error={!!errors.firstName}
                                                helperText={errors.firstName}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                        padding: '0 10px',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    sx: {
                                                        fontSize: '14px',
                                                    },
                                                }} />
                                        </Grid>
                                        <Grid item xs={10} sm={5}>
                                            <TextField required fullWidth id="lastName" label={t('lastName')} name="lastName" autoComplete="family-name" value={lastName}
                                                onChange={handleChange}
                                                error={!!errors.lastName}
                                                helperText={errors.lastName}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                        padding: '0 10px',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    sx: {
                                                        fontSize: '14px',
                                                    },
                                                }} />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <TextField required fullWidth id="email" label={t('email')} name="email" autoComplete="email" value={email}
                                                onChange={handleChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                        padding: '0 10px',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    sx: {
                                                        fontSize: '14px',
                                                    },
                                                }} />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <TextField required fullWidth name="phoneNo" label={t('phoneNumber')} id="phoneNo" value={phoneNo}
                                                onChange={handleChange}
                                                error={!!errors.phoneNo}
                                                helperText={errors.phoneNo}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                        padding: '0 10px',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    sx: {
                                                        fontSize: '14px',
                                                    },
                                                }} />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <TextField required fullWidth name="password" label={t('password')} type={passwordVisible ? 'text' : 'password'} id="password" autoComplete="new-password" value={password}
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
                                        <Grid item xs={10}>
                                            <TextField required fullWidth name="confirm_password" label={t('confirmPassword')} type={confirmPasswordVisible ? 'text' : 'password'} id="confirm_password" autoComplete="new-password" value={confirm_password}
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
                                        <Grid item xs={10}>
                                            <TextField fullWidth name="company" label={t('companyNameOptional')} id="company" value={company} onChange={handleChange}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                        padding: '0 10px',
                                                    },
                                                }}
                                                InputLabelProps={{
                                                    sx: {
                                                        fontSize: '14px',
                                                    },
                                                }} />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{
                                                    mt: 1, mb: 2, height: '50px', fontSize: '18px', bgcolor: '#ba343b',
                                                    '&:hover': { bgcolor: '#9e2b31' },
                                                }}>
                                                {t('signUp')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ width: 'fit-content', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <GoogleLogin
                                            onSuccess={handleGoogleLoginSuccess}
                                            onError={() => {
                                                console.log('Login Failed');
                                            }}
                                            style={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}
                                        />
                                    </Box>
                                    <Grid container justifyContent="center">
                                        <Grid item>
                                            <div style={{ marginTop: '15px' }}>
                                                <div variant="body2" style={{ color: 'black' }}>
                                                    {t('alreadyHaveAccount')}{' '}
                                                    <Link to="/login">
                                                        <span style={{ color: '#1976db' }}>Sign In</span>
                                                    </Link>
                                                </div>
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
                                <TextField required fullWidth name="password" label={t('password')} type={passwordVisible ? 'text' : 'password'} id="password" autoComplete="new-password" value={password}
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
                                <TextField required fullWidth name="confirm_password" label={t('confirmPassword')} type={confirmPasswordVisible ? 'text' : 'password'} id="confirm_password" autoComplete="new-password" value={confirm_password}
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
                                <Button fullWidth variant="contained" onClick={handleGoogleSubmit} sx={{ bgcolor: '#ba343b', color: 'white', height: 50, fontSize: 16, '&:hover': { bgcolor: '#9e2b31', }, mt: 15, '&:disabled': { bgcolor: '#e0e0e0', color: '#a0a0a0', } }}
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

export default SignUp;