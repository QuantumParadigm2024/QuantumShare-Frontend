import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from './action/dataslice';
import axiosInstance from '../Helper/AxiosInstance';
import CryptoJS from 'crypto-js';
import { secretKey } from '../Helper/SecretKey';

export const FetchUser = async (dispatch, onSessionExpired) => {
    dispatch(fetchDataRequest());

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

    try {
        const response = await axiosInstance.get('/quantum-share/user/info', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('User Data:', response.data);
        dispatch(fetchDataSuccess(response.data));
    } catch (err) {
        console.error('Error fetching user info:', err.response);
        if (err.response && err.response.data.code === 121) {
            console.log('Session expired, triggering callback');
            localStorage.removeItem('qs');
            onSessionExpired();
        } else {
            dispatch(fetchDataFailure(err.message || 'An error occurred'));
        }
    }
};