import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboardCustomize } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdOutlineJoinRight } from "react-icons/md";
import EqualizerOutlinedIcon from '@mui/icons-material/EqualizerOutlined';
import { useEffect } from 'react';
import Post from '../Sidebar/Post';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { RiSendPlaneFill } from "react-icons/ri";
import { Outlet } from 'react-router-dom';
import QI from '../Sidebar/QI';
import { useTranslation } from 'react-i18next';
import SaveAsIcon from '@mui/icons-material/SaveAs';

const Sidenav = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openPost, setOpenPost] = useState(false);
    const [AIopen, setAIopen] = useState(false)
    const { t } = useTranslation('');

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        // console.log("Invoked");
    }, [openPost]);

    const handlePublish = () => {
        setOpenPost(!openPost);
    };

    const handleClosePost = () => {
        setOpenPost(false);
    };

    const handleAIComponent = () => {
        setAIopen(!AIopen)
    }

    const handleAIClose = () => {
        setAIopen(false)
    }

    const menuItem = [
        {
            name: t('dashboard'),
            icon: <MdDashboardCustomize />,
            path: "/dashboard"
        },
        {
            name: t('socialIntegration'),
            icon: <MdOutlineJoinRight />,
            path: '/social-integration'
        },
        {
            name: <div onClick={handlePublish}>{t('publish')}</div>,
            icon: <RiSendPlaneFill onClick={handlePublish} />
        },
        {
            name: <div onClick={handleAIComponent}>{t('quantumAI')}</div>,
            icon: <AutoAwesomeIcon onClick={handleAIComponent} />
        },
        {
            name: t('analytics'),
            icon: <EqualizerOutlinedIcon />,
            path: '/analytics'
        },
        {
            name: t('accountOverview'),
            icon: <MdOutlineAccountCircle />,
            path: "/account-overview"
        },
        {
            name: <div>{t('Draft')}</div>,
            icon: <SaveAsIcon />,
            path: "/drafts"
        }
    ];

    return (
        <div className="container">
            <div
                className="sidebar"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ width: isOpen ? "250px" : "80px" }}>
                <div className="top_section">
                    <div style={{ marginLeft: isOpen ? "40px" : "0px" }} className="bars"></div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className='prat'>
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                            <div style={{ display: isOpen ? "none" : "block" }} className="name_below_icon">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
            <Outlet />
            {openPost && <Post onClose={handleClosePost} />}
            {AIopen && <QI onAiClose={handleAIClose} />}
        </div>
    );
};

export default Sidenav;
