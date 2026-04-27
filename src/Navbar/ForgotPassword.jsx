/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Grid, TextField, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QS from '../Assets/QS.webp';
import axiosInstance from '../Helper/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogContentText, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { InputAdornment } from '@mui/material';

const ForgotPassword = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(true);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [timer, setTimer] = useState(300);
    const [canResend, setCanResend] = useState(false);
    const { t } = useTranslation('');
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\])[A-Za-z\d!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleClose = () => {
        setOpen(false);
        navigate("/login");
    };

    const handleOtpModalClose = () => {
        setOtpModalOpen(false);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
        setNewPassword('');
        setConfirmPassword('');
        navigate("/login");
    };

    const handleNext = async () => {
        setEmailError('');
        setError('');
        setLoading(true);

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get(`/quantum-share/user/forgot/password/request`, {
                params: { email }
            });
            if (response.data.status === 'success') {
                setOtpModalOpen(true);
                startTimer();
            }
        } catch (error) {
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            }
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    const startTimer = () => {
        setTimer(300);
        setCanResend(false);
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setOtpError('');
            
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const digits = pastedText.replace(/\D/g, '');
        
        if (digits.length === 6) {
            const otpArray = digits.split('');
            setOtp(otpArray);
        } else {
            setOtpError('Please paste a valid 6-digit OTP');
        }
    };

    const handleResetPassword = async () => {
        const otpValue = otp.join('');
        
        if (otpValue.length !== 6) {
            setOtpError('Please enter complete 6-digit OTP');
            return;
        }
        
        setPasswordError('');
        
        if (!newPassword) {
            setPasswordError('Password is required');
            return;
        }
        
        if (!isPasswordValid(newPassword)) {
            setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        
        setOtpLoading(true);
        
        try {
            const response = await axiosInstance.post(`/quantum-share/user/update/password/request?token=${otpValue}&password=${newPassword}`);
            if (response.data.status === 'success') {
                setOtpModalOpen(false);
                navigate("/login");
            }
        } catch (error) {
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            }
            if (error.response && error.response.data) {
                setOtpError(error.response.data.message || 'Invalid or expired OTP');
            }
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) {
            return;
        }
        
        try {
            const response = await axiosInstance.get(`/quantum-share/user/forgot/password/request`, {
                params: { email }
            });
            if (response.data.status === 'success') {
                startTimer();
                setOtp(['', '', '', '', '', '']);
                setOtpError('');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setOtpError(error.response.data.message || 'Failed to resend OTP');
            }
        }
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

    return (
        <>
            <Box
                maxWidth="sm"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '80%', md: '70%' },
                    height: { xs: 'auto', md: 'auto' },
                    maxHeight: '90vh',
                    bgcolor: 'white',
                    color: '#1C1C1C',
                    boxShadow: 5,
                    p: { xs: 2, sm: 4 },
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    filter: otpModalOpen ? 'blur(4px)' : 'none',
                    overflowY: 'auto',
                }}
            >
                <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, color: '#ba343b' }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <Box>
                    <Typography
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2
                        }}>
                        <img src={QS} alt="" style={{ height: 35 }} />
                    </Typography>
                    <Typography sx={{ color: '#ba343b', fontSize: '20px', textAlign: 'center' }}>
                        {t('findQuantumShareAccount')}
                    </Typography>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ margin: '10px 0', color: 'gray' }}
                    >
                        {t('enterEmailToChangePassword')}
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="E-mail"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={!!error || !!emailError}
                                    helperText={error || emailError}
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
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{
                                        bgcolor: '#ba343b',
                                        color: 'white',
                                        height: 50,
                                        fontSize: 16,
                                        mt: 3,
                                        '&:hover': { bgcolor: '#9e2b31' },
                                        '&:disabled': { bgcolor: '#e0e0e0', color: '#a0a0a0' },
                                    }}
                                    disabled={!email || loading}
                                >
                                    {loading ? <TailSpin color="#ba343b" height={25} width={25} /> : 'Next'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
            
            {/* OTP and Reset Password Modal */}
            <Modal
                open={otpModalOpen}
                onClose={handleOtpModalClose}
                aria-labelledby="otp-modal-title"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 450 },
                        bgcolor: 'white',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ color: '#ba343b', mb: 2 }}>
                        Reset Password
                    </Typography>
                    <Typography sx={{ mb: 2, color: 'gray' }}>
                        Enter the 6-digit OTP sent to {email}
                    </Typography>
                    
                    <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                        {otp.map((digit, index) => (
                            <Grid item xs={1.5} key={index}>
                                <TextField
                                    id={`otp-input-${index}`}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    inputProps={{
                                        style: { textAlign: 'center', fontSize: '24px', padding: '12px 0' },
                                        maxLength: 1
                                    }}
                                    variant="outlined"
                                    autoFocus={index === 0}
                                    error={!!otpError}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    
                    {otpError && (
                        <Typography color="error" sx={{ mb: 2, fontSize: '14px' }}>
                            {otpError}
                        </Typography>
                    )}
                    
                    <TextField
                        fullWidth
                        type={passwordVisible ? 'text' : 'password'}
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={!!passwordError}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <EndAdornment
                                    visible={passwordVisible}
                                    setVisible={setPasswordVisible}
                                />
                            )
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <EndAdornment
                                    visible={confirmPasswordVisible}
                                    setVisible={setConfirmPasswordVisible}
                                />
                            )
                        }}
                    />
                    
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleResetPassword}
                        disabled={otpLoading}
                        sx={{
                            bgcolor: '#ba343b',
                            color: 'white',
                            height: 45,
                            mb: 2,
                            '&:hover': { bgcolor: '#9e2b31' }
                        }}
                    >
                        {otpLoading ? <TailSpin color="#ffffff" height={25} width={25} /> : 'Reset Password'}
                    </Button>
                    
                    <Typography variant="body2" color="textSecondary">
                        {canResend ? (
                            <Button onClick={handleResendOTP} sx={{ color: '#ba343b', textTransform: 'none' }}>
                                Resend OTP
                            </Button>
                        ) : (
                            `Resend OTP in ${formatTime(timer)}`
                        )}
                    </Typography>
                </Box>
            </Modal>
            
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

export default ForgotPassword;