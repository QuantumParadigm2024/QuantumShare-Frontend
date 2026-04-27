/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, ListItemIcon, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { List, ListItem, ListItemText } from '@mui/material';
import { Person, PersonOutline, PrivacyTipOutlined } from "@mui/icons-material";
import { IoLanguage } from "react-icons/io5";
import QS from '../Assets/QS.webp';

const Nav = () => {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    let navigate = useNavigate();
    let token = localStorage.getItem("qs");
    const [translateVisible, setTranslateVisible] = useState(false);
    const [translateAnchorEl, setTranslateAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 970);
    const isSmallerThan970 = useMediaQuery(theme.breakpoints.down(970));

    // Event listener to update state on window resize
    window.addEventListener('resize', () => {
        setIsSmallScreen(window.innerWidth < 970);
    });

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("qs");
        navigate("/");
    };

    const handleMouseEnterButton = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMouseLeaveButton = () => {
        setTimeout(() => {
            if (!anchorEl) {
                setAnchorEl(null);
            }
        }, 200);
    };

    const handleMouseEnterMenu = () => {
        setAnchorEl(anchorEl);
    };

    const handleMouseLeaveMenu = () => {
        setTimeout(() => {
            setAnchorEl(null);
        }, 200);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleTranslateToggle = (event) => {
        setTranslateAnchorEl(event.currentTarget);
        setTranslateVisible((prev) => !prev);
    };

    const handleTranslateMenuClose = () => {
        setTranslateAnchorEl(null);
        setTranslateVisible(false);
    };

    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: "en",
                autoDisplay: false
            },
            "google_translate_element"
        );
    };

    useEffect(() => {
        if (translateVisible) {
            const addScript = document.createElement("script");
            addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            addScript.async = true;
            addScript.onerror = () => console.error("Google Translate script failed to load.");
            document.body.appendChild(addScript);
            window.googleTranslateElementInit = googleTranslateElementInit;
        }
    }, [translateVisible]);

    return (
        <AppBar position="sticky" sx={{ bgcolor: 'white', height: '75px' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <Link to="/" className="title">
                            <img src={QS} alt="" style={{ height: 35, marginTop: '16px' }} />
                        </Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', color: 'grey' }, marginTop: '10px' }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <List>
                                <ListItem component={Link} to="/" onClick={handleCloseNavMenu}>
                                    <ListItemText primary="Home" />
                                </ListItem>
                                <ListItem component={Link} to="/about" onClick={handleCloseNavMenu}>
                                    <ListItemText primary="About" />
                                </ListItem>
                                <ListItem component={Link} to="/feature" onClick={handleCloseNavMenu}>
                                    <ListItemText primary="Features" />
                                </ListItem>
                                <ListItem component={Link} to="/pricing" onClick={handleCloseNavMenu}>
                                    <ListItemText primary="Pricing" />
                                </ListItem>
                                <ListItem component={Link} to="/QAi" onClick={handleCloseNavMenu}>
                                    <ListItemText primary="Quantum AI" />
                                </ListItem>
                            </List>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={QS} alt="Logo" style={{ height: 30, width: 'auto', marginTop: '10px' }} />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '10px' }}>
                        {token ? null : (
                            <List
                                component={Link}
                                to="/"
                                onClick={handleCloseNavMenu}
                                sx={{ color: 'black', textDecoration: 'none', fontSize: '16px' }}
                            >
                                Home
                            </List>
                        )}
                        <List
                            component={Link}
                            to="/about"
                            onClick={handleCloseNavMenu}
                            sx={{ color: 'black', textDecoration: 'none', fontSize: '16px' }}
                        >
                            About
                        </List>
                        <List
                            component={Link}
                            to="/feature"
                            onClick={handleCloseNavMenu}
                            sx={{ color: 'black', textDecoration: 'none', fontSize: '16px' }}
                        >
                            Features
                        </List>
                        <List
                            component={Link}
                            to="/pricing"
                            onClick={handleCloseNavMenu}
                            sx={{ color: 'black', textDecoration: 'none', fontSize: '16px' }}
                        >
                            Pricing
                        </List>
                        <List
                            component={Link}
                            to="/QAi"
                            onClick={handleCloseNavMenu}
                            sx={{ color: 'black', textDecoration: 'none', fontSize: '16px' }}
                        >
                            Quantum AI
                        </List>
                        <Menu
                            anchorEl={translateAnchorEl}
                            open={Boolean(translateAnchorEl)}
                            onClose={handleTranslateMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            {translateVisible && (
                                <Box id="google_translate_element" sx={{ padding: 2 }} />
                            )}
                        </Menu>
                    </Box>
                    <Box>
                        <button onClick={handleTranslateToggle}
                            style={{
                                backgroundColor: '#fff',
                                color: '#ba343b',
                                border: isSmallScreen ? 'none' : '1px solid #ba343b',
                                borderRadius: '4px',
                                width: isSmallScreen ? '2rem' : '6.7rem',
                                height: '2.4rem',
                                marginTop: '10px',
                                marginRight: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '1px',
                                cursor: 'pointer'
                            }}
                        >
                            <IoLanguage style={{ fontSize: '20px', fontWeight: '600' }} />
                            <List sx={{ display: isSmallerThan970 ? 'none' : 'flex', fontSize: '16px' }}>
                                Translate
                            </List>
                        </button>
                    </Box>
                    {!token && (
                        <Box>
                            <Link to="/login">
                                <Button
                                    sx={{
                                        color: '#ba343b',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        border: '1px solid #ba343b',
                                        marginTop: '10px',
                                    }}
                                    variant="outlined"
                                >
                                    Login
                                </Button>
                            </Link>
                        </Box>
                    )}
                    {!token && (
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Link to="/signUp">
                                <Button
                                    sx={{
                                        bgcolor: '#ba343b',
                                        color: 'white',
                                        '&:hover': { bgcolor: '#9e2b31' },
                                        marginLeft: '7px',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        borderRadius: '20px',
                                        marginTop: '10px'
                                    }}
                                >
                                    Try Free Trail
                                </Button>
                            </Link>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex' }}>
                        {token && (
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, marginLeft: 'auto' }}>
                                <Link to="/dashboard">
                                    <Button sx={{ color: '#ba343b', fontSize: '14.5px', fontWeight: '600', marginTop: '12px' }}>
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    onMouseEnter={handleMouseEnterButton}
                                    onMouseLeave={handleMouseLeaveButton}
                                    sx={{ color: '#ba343b', marginTop: '10px' }}
                                >
                                    <Person />
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        onMouseEnter: handleMouseEnterMenu,
                                        onMouseLeave: handleMouseLeaveMenu,
                                    }}
                                >
                                    <MenuItem component={Link} to='/account-overview'>
                                        <ListItemIcon>
                                            <PersonOutline />
                                        </ListItemIcon>
                                        Profile
                                    </MenuItem>
                                    <MenuItem component={Link} to='/privacy-policy'>
                                        <ListItemIcon>
                                            <PrivacyTipOutlined />
                                        </ListItemIcon>
                                        Privacy Policy
                                    </MenuItem>
                                    <MenuItem onClick={handleClickOpen}>
                                        <ListItemIcon>
                                            <LogoutIcon />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                    <Dialog open={open} onClose={handleCloseDialog} fullWidth>
                                        <DialogContent>
                                            <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>
                                                Are you sure you want to logout?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                                            <Button onClick={handleLogout} color="primary">Yes</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Menu>
                            </Box>
                        )}
                    </Box>
                    {token && (
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <Button
                                onMouseEnter={handleMouseEnterButton}
                                onMouseLeave={handleMouseLeaveButton}
                                sx={{ color: '#ba343b', marginTop: '10px' }}
                            >
                                <Person />
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                MenuListProps={{
                                    onMouseEnter: handleMouseEnterMenu,
                                    onMouseLeave: handleMouseLeaveMenu,
                                }}
                            >
                                <MenuItem component={Link} to='/account-overview'>
                                    <ListItemIcon>
                                        <PersonOutline />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>
                                <MenuItem component={Link} to='/privacy-policy'>
                                    <ListItemIcon>
                                        <PrivacyTipOutlined />
                                    </ListItemIcon>
                                    Privacy Policy
                                </MenuItem>
                                <MenuItem onClick={handleClickOpen}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                                <Dialog open={open} onClose={handleCloseDialog} fullWidth>
                                    <DialogContent>
                                        <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>
                                            Are you sure you want to logout?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
                                        <Button onClick={handleLogout} color="primary">Yes</Button>
                                    </DialogActions>
                                </Dialog>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Nav;