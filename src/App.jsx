/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars*/
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './global.css';
import Dashboard from './Sidebar/Dashboard';
import Home from './Pages/Home';
import Login from './Navbar/Login';
import SignUp from './Navbar/SignUp';
import Verification from './Navbar/Verification';
import About from './Pages/About';
import Features from './Pages/Features';
import Pricing from './Pages/Pricing';
import AccountOverview from './Sidebar/AccountOverview';
import Analytics from './Sidebar/Analytics'
import QuantumAIPage from './Pages/QuantumAIPage';
import SocialMediaLogin from './SocialMediaLogin/SocialMediaLogin';
import YoutubeCallback from './SocialMediaLogin/YoutubeCallback';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import ConnectSocialMedia from './ConnectionInfo/ConnectSocialMedia';
import PrivateRoute from './Helper/PrivateRoute';
import ReferenceVideo from './Pages/ReferenceVideo';
import LinkedInCallback from './SocialMediaLogin/LinkedInCallback';
import ForgotPassword from './Navbar/ForgotPassword';
import ResetPassword from './Navbar/ResetPassword';
import UpdateVerification from './Navbar/UpdateVerification';
import RegeneratePassword from './Navbar/RegeneratePassword';
import RedditCallback from './SocialMediaLogin/RedditCallback';
import PinterestCallback from './SocialMediaLogin/PinterestCallback';
import AdminDashboard from './Admin/AdminDashboard';

const App = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>Quantum Share - Simplify Social Media & File Sharing | Secure & Easy</title>
                <meta name="description" content="Quantum Share offers a seamless and secure way to share files and posts across social media. Revolutionize your sharing experience with our easy-to-use, privacy-focused platform." />
                <link rel="canonical" href='/home' />
            </Helmet>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/verify' element={<Verification />} />
                    <Route path='/signUp' element={<SignUp />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/feature' element={<Features />} />
                    <Route path='/QAi' element={<QuantumAIPage />} />
                    <Route path='/pricing' element={<Pricing />} />
                    <Route path='/admindashboard' element={<AdminDashboard />} />
                    <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                    <Route path='/reference-video' element={<ReferenceVideo />} />
                    <Route path='/regenerate-password' element={<RegeneratePassword />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path="/user/rest_password/request" element={<ResetPassword />} />
                    <Route path='/verify/update' element={<UpdateVerification />} />
                    <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path='/social-integration' element={<PrivateRoute><SocialMediaLogin /></PrivateRoute>} />
                    <Route path='/account-overview' element={<PrivateRoute><AccountOverview /></PrivateRoute>} />
                    <Route path='/analytics' element={<PrivateRoute><Analytics /></PrivateRoute>} />
                    <Route path='/connect-socialmedia' element={<PrivateRoute><ConnectSocialMedia /></PrivateRoute>} />
                    <Route path='/quantum-share/linkedin/callback/success' element={<PrivateRoute><LinkedInCallback /></PrivateRoute>} />
                    <Route path='/youtube/callback/getChannelDetails' element={<PrivateRoute><YoutubeCallback /></PrivateRoute>} />
                    <Route path='/quantum-share/callback/reddit' element={<PrivateRoute><RedditCallback /></PrivateRoute>} />
                    <Route path='/quantum-share/pinterest/callback/profileDetails' element={<PrivateRoute><PinterestCallback /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
};

export default App;