/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QS from '../Assets/QS.webp';
import axiosInstance from '../Helper/AxiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [open, setOpen] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation('');

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        setToken(query.get('token') || '');
    }, [location.search]);

    const handleClose = () => {
        setOpen(false);
        navigate("/forgot-password");
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\])[A-Za-z\d!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleUpdate = async () => {
        setPasswordError('');
        setConfirmPasswordError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.');
            setLoading(false);
            return;
        }
        try {
            const response = await axiosInstance.post(`/quantum-share/user/update/password/request`, null, {
                params: {
                    token: token,
                    password: password
                }
            });
            if (response.data.status === 'success') {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 4000);
            }
        } catch (error) {
            console.error('Error updating password:', error);
            if (error.response){
                toast.error('Error updating password. Please try again.');
            }
            else if (error.response.data.code === 121) {
                localStorage.removeItem('qs');
                navigate('/session'); 
            }
        } finally {
            setLoading(false);
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

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

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
                    bgcolor: 'white',
                    color: '#1C1C1C',
                    boxShadow: 5,
                    p: { xs: 2, sm: 4 },
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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
                        }}>
                        <img src={QS} alt="" style={{ height: 35, marginTop: '5px' }} />
                    </Typography>
                    <Typography sx={{ m: 0, p: 2, color: '#ba343b', fontSize: { xs: '18px', md: '20px' }, textAlign: 'center' }}>
                        {t('resetPassword')}
                    </Typography>
                    <Typography
                        variant="body2"
                        textAlign="start"
                        sx={{ margin: '5px 0', color: 'gray', fontSize: { xs: '14px', md: '16px' }} }
                    >
                        {t('resetPasswordDescription')}
                    </Typography>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="New Password"
                                    type={passwordVisible ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    autoFocus
                                    InputProps={{
                                        sx: {
                                            height: '50px',
                                        },
                                        endAdornment: (
                                            <EndAdornment
                                                visible={passwordVisible}
                                                setVisible={handleTogglePasswordVisibility}
                                            />
                                        ),
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm New Password"
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={!!confirmPasswordError}
                                    helperText={confirmPasswordError}
                                    InputProps={{
                                        sx: {
                                            height: '50px',
                                        },
                                        endAdornment: (
                                            <EndAdornment
                                                visible={confirmPasswordVisible}
                                                setVisible={handleToggleConfirmPasswordVisibility}
                                            />
                                        ),
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            fontSize: '14px',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleUpdate}
                                    sx={{
                                        mt: 3,
                                        bgcolor: '#ba343b',
                                        color: 'white',
                                        height: 50,
                                        fontSize: 16,
                                        '&:hover': { bgcolor: '#9e2b31' },
                                        '&:disabled': { bgcolor: '#e0e0e0', color: '#a0a0a0' },
                                    }}
                                    disabled={!password || !confirmPassword || loading}
                                >
                                    {loading ? <TailSpin color="#ba343b" height={25} width={25} /> : 'Update'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
            <ToastContainer />
        </>
    );
};

export default ResetPassword;