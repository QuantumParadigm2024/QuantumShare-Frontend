// VerifyOTP.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Grid, CssBaseline, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import axiosInstance from '../Helper/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QS from '../Assets/QS.webp';
import { TailSpin } from 'react-loader-spinner';

const defaultTheme = createTheme();

const VerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(300);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    
    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
        
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
        
        return () => clearInterval(interval);
    }, [email, navigate]);

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
            
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste event
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const digits = pastedText.replace(/\D/g, '');
        
        if (digits.length === 6) {
            const otpArray = digits.split('');
            setOtp(otpArray);
            // Auto-verify after paste
            setTimeout(() => {
                handleVerifyOTP(digits);
            }, 100);
        } else {
            toast.error('Please paste a valid 6-digit OTP');
        }
    };

    const handleVerifyOTP = async (autoOtp = null) => {
        const otpValue = autoOtp || otp.join('');
        
        if (otpValue.length !== 6) {
            toast.error('Please enter complete 6-digit OTP');
            return;
        }
        
        setLoading(true);
        
        try {
            const endpoint = `/quantum-share/user/verify?token=${otpValue}&email=${email}`;
            const response = await axiosInstance.get(endpoint);
            
            if (response.data.status === 'success') {
                toast.success('Email verified successfully!');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.error(response.data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) {
            toast.error(`Please wait ${formatTime(timer)}`);
            return;
        }
        
        setResendLoading(true);
        
        try {
            const response = await axiosInstance.post('/quantum-share/user/resend-otp', { email });
            
            if (response.data.status === 'success') {
                toast.success('New OTP sent');
                setTimer(300);
                setCanResend(false);
                setOtp(['', '', '', '', '', '']);
                
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
            }
        } catch (error) {
            toast.error('Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ margin: 'auto', borderRadius: '10px' }}>
                    <Box sx={{ my: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={QS} alt="Quantum Share" style={{ height: 50, marginBottom: 20 }} />
                        
                        <Avatar sx={{ m: 1, bgcolor: '#ba343b' }}>
                            <VerifiedUserOutlinedIcon />
                        </Avatar>
                        
                        <Typography component="h1" variant="h5" sx={{ color: '#ba343b' }}>
                            Verify Your Email
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                            Enter 6-digit OTP sent to {email}
                        </Typography>
                        
                        <Box sx={{ mt: 3 }}>
                            <Grid container spacing={2} justifyContent="center">
                                {otp.map((digit, index) => (
                                    <Grid item xs={1.5} key={index}>
                                        <TextField
                                            inputRef={(el) => inputRefs.current[index] = el}
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
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleVerifyOTP()}
                            disabled={loading}
                            sx={{ mt: 4, mb: 2, height: '50px', bgcolor: '#ba343b', '&:hover': { bgcolor: '#9e2b31' } }}
                        >
                            {loading ? <TailSpin color="#ffffff" height={25} width={25} /> : 'Verify Email'}
                        </Button>
                        
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                onClick={handleResendOTP}
                                disabled={!canResend || resendLoading}
                                sx={{ color: '#ba343b' }}
                            >
                                {resendLoading ? <TailSpin color="#ba343b" height={20} width={20} /> : 
                                 canResend ? 'Resend OTP' : `Resend in ${formatTime(timer)}`}
                            </Button>
                        </Box>
                        
                        <Button onClick={() => navigate('/login')} sx={{ mt: 2, color: '#666' }}>
                            Back to Login
                        </Button>
                    </Box>
                </Grid>
                <ToastContainer />
            </Grid>
        </ThemeProvider>
    );
};

export default VerifyOTP;