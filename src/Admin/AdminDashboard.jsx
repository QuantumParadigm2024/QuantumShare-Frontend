import React, { useState } from 'react';
import Button from '@mui/material/Button';
import axiosInstance from '../Helper/AxiosInstance';
import { TailSpin } from 'react-loader-spinner';
import { TextField, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
    const [userInfo, setUserInfo] = useState({ count: 0, show: false });
    const [loading, setLoading] = useState(false);
    const [showIncreaseForm, setShowIncreaseForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [formData, setFormData] = useState({ email: '', additionalCredits: 0 });
    const [deleteEmail, setDeleteEmail] = useState({ email: '' });
    const handleUser = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/quantumshare/admin/userCount');
            const userCount = response.data.data;
            setUserInfo(prevState => ({
                ...prevState,
                count: userCount,
                show: !prevState.show,
            }));
            toast.success('User count fetched successfully');
        } catch (error) {
            console.error('Error fetching user count:', error);
            toast.error('Error fetching user count');
        } finally {
            setLoading(false);
        }
    };

    const toggleIncreaseForm = () => {
        setShowIncreaseForm(prev => !prev);
        if (showIncreaseForm) {
            setFormData({ email: '', additionalCredits: 0 });
        }
    };

    const toggleDeleteForm = () => {
        setShowDeleteForm(prev => !prev);
        if (showDeleteForm) {
            setDeleteEmail({ email: '' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'additionalCredits') {
            setFormData(prevState => ({
                ...prevState,
                [name]: Number(value),
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmitIncreaseCredits = async (e) => {
        e.preventDefault();
        const { email, additionalCredits } = formData;
        try {
            const endpoint = `/quantumshare/admin/increaseCredits?email=${encodeURIComponent(email)}&additionalCredits=${additionalCredits}`;
            const response = await axiosInstance.post(endpoint);
            console.log('Credits increased:', response.data);
            toast.success(response.data.message);
            toggleIncreaseForm();
        } catch (error) {
            console.error('Error increasing credits:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
            toast.error(errorMessage);
        }
    };

    const handleSubmitDeleteUser = async (e) => {
        e.preventDefault();
        const { email } = deleteEmail;

        if (!email) {
            console.error('No email provided for deletion.');
            return;
        }

        try {
            const endpoint = `/quantumshare/admin/deleteUser?email=${encodeURIComponent(email)}`;
            const response = await axiosInstance.delete(endpoint);

            console.log('User deleted successfully:', response.data);
            toast.success(response.data.message);
            toggleDeleteForm();
        } catch (error) {
            console.error('Error deleting user:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred.';
                toast.error(errorMessage);
            } else {
                console.error('Request failed. Network issue or invalid request.');
            }
        }
    };

    return (
        <>
            <Button
                type="submit"
                variant="contained"
                sx={{
                    mb: 1,
                    height: '50px',
                    marginTop: '20px',
                    fontSize: '18px',
                    bgcolor: '#ba343b',
                    width: '120px',
                    '&:hover': { bgcolor: '#9e2b31' },
                }}
                onClick={handleUser}
            >
                {loading ? (
                    <TailSpin height="30" width="30" color="#fff" ariaLabel="loading" />
                ) : (
                    userInfo.show ? userInfo.count : 'count'
                )}
            </Button>

            <Button
                type="button"
                variant="contained"
                sx={{
                    mb: 1,
                    height: '50px',
                    marginTop: '20px',
                    fontSize: '18px',
                    bgcolor: '#ba343b',
                    '&:hover': { bgcolor: '#9e2b31' },
                }}
                onClick={toggleIncreaseForm}
            >
                Increase Credit
            </Button>

            <Button
                type="button"
                variant="contained"
                sx={{
                    mb: 1,
                    height: '50px',
                    marginTop: '20px',
                    fontSize: '18px',
                    bgcolor: '#ba343b',
                    '&:hover': { bgcolor: '#9e2b31' },
                }}
                onClick={toggleDeleteForm}
            >
                Delete User
            </Button>
            <form onSubmit={handleSubmitIncreaseCredits}>
                {showIncreaseForm && (
                    <Box sx={{ mt: 2, p: 2, width: '300px' }}>
                        <h3>Increase the user credits</h3><br />
                        <TextField
                            label="Email"
                            name='email'
                            value={formData.email}
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        /> <br />
                        <TextField
                            label="Additional Credits"
                            name='additionalCredits'
                            type='number'
                            value={formData.additionalCredits}
                            fullWidth
                            onChange={handleChange}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <div>
                            <Button type="submit" variant="contained">Submit</Button>
                            <Button type="button" variant="contained" onClick={toggleIncreaseForm} sx={{ marginLeft: '17px', }}>Cancel</Button>
                        </div>
                    </Box>
                )}
            </form>

            {/* Delete User Form */}
            <form onSubmit={handleSubmitDeleteUser}>
                {showDeleteForm && (
                    <Box sx={{ mt: 2, p: 2, width: '300px' }}>
                        <h3>Delete User</h3><br />
                        <TextField
                            label="Email"
                            name='deleteEmail'
                            value={deleteEmail.email}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setDeleteEmail({ email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <div>
                            <Button type="submit" variant="contained">Confirm Delete</Button>
                            <Button type="button" variant="contained" onClick={toggleDeleteForm} sx={{ marginLeft: '17px', }}>Cancel</Button>
                        </div>
                    </Box>
                )}
            </form>
            <ToastContainer />
        </>
    );
};

export default AdminDashboard;