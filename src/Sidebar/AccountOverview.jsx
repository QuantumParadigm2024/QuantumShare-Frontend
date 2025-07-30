/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../Helper/AxiosInstance';
import { TailSpin } from 'react-loader-spinner';
import Nav from '../Navbar/Nav';
import Sidenav from '../Navbar/Sidenav';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import blankimage from '../Assets/BlankProfileImage.jpg';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { Dialog, DialogContent, DialogContentText, DialogActions, Button, IconButton, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';
import { useDispatch, useSelector } from 'react-redux';
import { FetchUser } from '../Redux/FetchUser';

const AccountOverview = () => {
    const { remainingDays, trail, subscription } = useSelector((state) => state.data);
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [open, setOpen] = useState(false);
    const [tempData, setTempData] = useState({ email: '', firstname: '', lastname: '', phoneNo: '', company: '' });
    const [errors, setErrors] = useState({});
    let navigate = useNavigate();
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/quantum-share/user/account-overview', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data.data;
                setUserData(data);
                setTempData({
                    firstname: data.name.split(' ')[0] || '',
                    lastname: data.name.split(' ')[1] || '',
                    email: data.email || '',
                    phoneNo: data.mobile || '',
                    company: data.company_name || '',
                });
                if (data.profile_pic) {
                    setProfile(data.profile_pic);
                }
            } catch (error) {
                if (error.response?.data?.code === 121) {
                    setIsSessionExpired(true);
                    localStorage.removeItem('qs');
                } else if (error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(URL.createObjectURL(file));
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({});
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        const formData = new FormData();
        const newErrors = {};
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        if (tempData.firstname && tempData.firstname !== userData.name.split(' ')[0]) {
            if (!nameRegex.test(tempData.firstname.trim())) {
                newErrors.firstname = 'First name should contain only alphabets';
            } else {
                formData.append('firstname', tempData.firstname);
            }
        }

        if (tempData.lastname && tempData.lastname !== userData.name.split(' ')[1]) {
            if (!nameRegex.test(tempData.lastname.trim())) {
                newErrors.lastname = 'Last name should contain only alphabets';
            } else {
                formData.append('lastname', tempData.lastname);
            }
        }

        if (tempData.phoneNo && tempData.phoneNo !== userData.mobile) {
            if (!phoneRegex.test(tempData.phoneNo.trim())) {
                newErrors.phoneNo = 'Please enter a valid 10-digit phone number';
            } else {
                formData.append('phoneNo', tempData.phoneNo);
            }
        }

        if (tempData.email && tempData.email !== userData.email) {
            if (!emailRegex.test(tempData.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            } else {
                formData.append('email', tempData.email);
            }
        }

        if (tempData.company && tempData.company !== userData.company_name) {
            formData.append('company', tempData.company);
        }

        if (fileInputRef.current && fileInputRef.current.files[0]) {
            formData.append('file', fileInputRef.current.files[0]);
        }

        if (Object.keys(newErrors).length > 0) {
            setLoading(false);
            setErrors(newErrors);
            toast.error('Please fix the validation errors');
            return;
        }

        if (!formData.has('firstname') && !formData.has('lastname') && !formData.has('phoneNo') &&
            !formData.has('company') && !formData.has('file') && !formData.has('email')) {
            toast.error("No changes to update.");
            setLoading(false);
            return;
        }
        try {
            const response = await axiosInstance.post('/quantum-share/user/account-overview', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(response.data.message);
            handleClose();
            setUserData({
                ...userData,
                name: `${tempData.firstname} ${tempData.lastname}`,
                email: tempData.email,
                mobile: tempData.phoneNo,
                company_name: tempData.company
            });
            if (tempData.email && tempData.email !== userData.email) {
                navigate('/verify/update');
            }
        } catch (error) {
            if (error.response?.data?.code === 121) {
                setIsSessionExpired(true);
                localStorage.removeItem('qs');
            } else if (error.response && error.response.status === 406) {
                toast.error("Account already exists with this email address");
            } else {
                toast.error('Error updating profile: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div>
                <Nav />
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
                        <Link to='/pricing' style={{ textDecoration: 'none', width: '50%' }}>
                            <Button
                                variant="contained"
                                fullWidth
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
                        </Link>
                    </DialogActions>
                </Dialog>
                <div style={{ display: 'flex' }}>
                    <Sidenav />
                    <div style={{ flexGrow: 1 }} id='accountOverview'>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                                <TailSpin height="40" width="40" color="#ba343b" ariaLabel="tail-spin-loading" radius="1" visible={true} />
                            </div>
                        ) : error ? (
                            <h1>Error</h1>
                        ) : (
                            userData && (
                                <div id='accountDisplay'>
                                    <h1>User Profile</h1>
                                    <div className="avatar-container">
                                        {profile ? (
                                            <img src={profile} className='avatar' />
                                        ) : (
                                            <img src={blankimage} className='avatar' />
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="accountInfo">
                                        <p>{`${userData.name}`}</p>
                                        <p><EmailIcon sx={{ marginBottom: '-8px', color: 'grey' }} /> {userData.email}</p>
                                        <p><PhoneIcon sx={{ marginBottom: '-8px', color: 'grey' }} /> {userData.mobile}</p>
                                        <p><BusinessIcon sx={{ marginBottom: '-8px', color: 'grey' }} /> {userData.company_name}</p>
                                    </div>
                                    <button className="editBtn" onClick={handleClickOpen}>
                                        Edit <BorderColorOutlinedIcon sx={{ marginBottom: '-1px', color: 'white', fontSize: '18px' }} />
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                    <div>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle sx={{ textAlign: 'center' }}>Edit Profile
                                <IoMdClose onClick={handleClose} style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer', color: '#ba343b' }} />
                            </DialogTitle>
                            <DialogContent className="dialog-content">
                                <div className="avatar-container-in">
                                    {profile ? (
                                        <img src={profile} alt="" className="avatar-in" />
                                    ) : (
                                        <img src={blankimage} alt="" className="avatar-in" />
                                    )}
                                    <div
                                        style={{ cursor: 'pointer', marginTop: '3px', display: 'block', textAlign: 'center', fontSize: 12, color: '#ba343b', fontWeight: '600', }}
                                        onClick={() => fileInputRef.current.click()}>Change Photo
                                    </div>
                                    <input type='file' ref={fileInputRef} style={{ display: 'none' }} accept='image/*' onChange={handleFileChange} />
                                </div>
                                <Divider sx={{ width: '450px', position: 'relative', top: '10px' }} />
                                <div id="scroll">
                                    <div className="textfield-container">
                                        <TextField label="First Name" fullWidth sx={{ marginTop: '10px' }} value={tempData.firstname} onChange={(e) => setTempData({ ...tempData, firstname: e.target.value })} error={Boolean(errors.firstname)} helperText={errors.firstname} />
                                    </div>
                                    <div className="textfield-container">
                                        <TextField label="Last Name" fullWidth sx={{ marginTop: '10px' }} value={tempData.lastname} onChange={(e) => setTempData({ ...tempData, lastname: e.target.value })} error={Boolean(errors.lastname)} helperText={errors.lastname} />
                                    </div>
                                    <div className="textfield-container">
                                        <TextField label="Email" fullWidth sx={{ marginTop: '10px' }} value={tempData.email} onChange={(e) => setTempData({ ...tempData, email: e.target.value })} error={Boolean(errors.email)} helperText={errors.email} />
                                    </div>
                                    <div className="textfield-container">
                                        <TextField label="Phone Number" fullWidth sx={{ marginTop: '10px' }} value={tempData.phoneNo} onChange={(e) => setTempData({ ...tempData, phoneNo: e.target.value })} error={Boolean(errors.phoneNo)} helperText={errors.phoneNo} />
                                    </div>
                                    <div className="textfield-container">
                                        <TextField label="Company Name" fullWidth sx={{ marginTop: '10px' }} value={tempData.company} onChange={(e) => setTempData({ ...tempData, company: e.target.value })} />
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <button onClick={handleSaveChanges}
                                    style={{ backgroundColor: '#ba343b', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', margin: '10px' }}>
                                    {loading ? (
                                        <TailSpin height="20" width="20" color="#fff" ariaLabel="loading" />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
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
            <ToastContainer />
        </>
    );
}

export default AccountOverview;