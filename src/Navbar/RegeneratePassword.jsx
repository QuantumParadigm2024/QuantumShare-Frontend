/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, Grid, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { TailSpin } from 'react-loader-spinner';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import axiosInstance from '../Helper/AxiosInstance';
import QS from '../Assets/QS.webp';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { FetchUser } from '../Redux/FetchUser';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

const RegeneratePassword = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        password: '',
        confirm_password: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const {t} = useTranslation('');

    const email = location.state?.email;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const isPasswordValid = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\])[A-Za-z\d!@#$%^&*_`~<>;:'"{|},.+=()\[\]\/\\]{8,}$/;
        return regex.test(password);
    };

    const handleRegenratePassword = async () => {
        setLoading(true);
        setErrors({});

        const { password, confirm_password } = formData;

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
            const endpoint = `/quantum-share/user/regenerate/password/google/auth?password=${encodeURIComponent(password)}&email=${encodeURIComponent(email)}`;
            const response = await axiosInstance.post(endpoint, null, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const encryptedToken = CryptoJS.AES.encrypt(response.data.data, secretKey).toString();
            localStorage.setItem('qs', encryptedToken);
            navigate('/dashboard');
            await FetchUser(dispatch);
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;
                if (message && status === 406) {
                    toast.error(message);
                }else if (error.response.data.code === 121) {
                    localStorage.removeItem('qs')
                    navigate('/session'); 
                } else {
                    console.error('Error regenerating password:', error);
                    toast.error('Error in regenerating password');
                }
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
                <Box >
                    <Typography
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <img src={QS} alt="" style={{ height: 35, marginTop: '5px' }} />
                    </Typography>
                    <Typography sx={{ m: 0, p: 2, color: '#ba343b', fontSize: '20px', textAlign: 'center' }}>
                        {t('regeneratePassword')}
                    </Typography>
                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ margin: '5px 0', color: 'gray', fontSize: { xs: '14px', md: '16px' }} }
                    >
                    
                </Typography>
                <Box component="form" noValidate sx={{ mt: 2 }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label={t('password')}
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
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
                                name="confirm_password"
                                label="Confirm Password"
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                id="confirm_password"
                                autoComplete="new-password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                error={!!errors.confirm_password}
                                helperText={errors.confirm_password}
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
                                onClick={handleRegenratePassword}
                                sx={{
                                    mt: 3,
                                    bgcolor: '#ba343b',
                                    color: 'white',
                                    height: 50,
                                    fontSize: 16,
                                    '&:hover': { bgcolor: '#9e2b31' },
                                    '&:disabled': { bgcolor: '#e0e0e0', color: '#a0a0a0' },
                                }}
                                disabled={!formData.password || !formData.confirm_password || loading}
                            >
                                {loading ? <TailSpin color="#ba343b" height={25} width={25} /> : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box >
        </>
    )
}

export default RegeneratePassword;