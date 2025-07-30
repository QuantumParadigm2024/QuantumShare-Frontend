/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from "../Helper/AxiosInstance";
import { toast } from 'react-toastify';

const TwitterCallback = () => {
    const token = localStorage.getItem('qs');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [channelImageUrl, setChannelImageUrl] = useState('');
    const [channelName, setChannelName] = useState('');
    const [subscriberCount, setSubscriberCount] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const code = query.get('code');
        if (code) {
            console.log(code);
            handleFetchProfileDetails(code);
        }
    }, [location]);

    const handleFetchProfileDetails = async (code) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/quantum-share/twitter/user/verify-token?code=${code}`, code, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const { channelImageUrl, channelName, subscriberCount } = response.data.data;
            localStorage.setItem('channelImageUrl', channelImageUrl);
            localStorage.setItem('channelName', channelName);
            localStorage.setItem('subscriberCount', subscriberCount);
            setChannelImageUrl(channelImageUrl);
            setChannelName(channelName);
            setSubscriberCount(subscriberCount);
            setIsLoggedIn(true);
            toast.success("Connected to Twitter!");
            navigate("/social-integration");
        } catch (error) {
            console.error('Error fetching profile details:', error);
            toast.error("Error Connecting to Twitter. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

        </>
    )
}

export default TwitterCallback