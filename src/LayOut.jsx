import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
    ListItem, ListItemButton, ListItemIcon, ListItemText, 
    CssBaseline, Avatar, IconButton, Badge, ThemeProvider, createTheme, 
    Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, 
    DialogActions, Button, Zoom
} from '@mui/material';
import {
    DashboardOutlined as DashboardIcon,
    AddCircleOutline as AddIcon,
    LibraryBooksOutlined as ViewIcon,
    GroupOutlined as PeopleIcon,
    LogoutRounded as LogoutIcon,
    NotificationsNoneOutlined as NotificationIcon,
    DarkModeOutlined as DarkModeIcon,
    LightModeOutlined as LightModeIcon,
    WarningAmberRounded as WarningIcon
} from '@mui/icons-material';

const drawerWidth = 280;

function LayOut({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [mode, setMode] = useState(localStorage.getItem('adminTheme') || 'light');
    // State for Logout Dialog
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    useEffect(() => {
        localStorage.setItem('adminTheme', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#6366f1' },
            background: {
                default: mode === 'light' ? '#f8fafc' : '#0f172a',
                paper: mode === 'light' ? '#ffffff' : '#1e293b',
            },
            text: {
                primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
                secondary: mode === 'light' ? '#64748b' : '#94a3b8',
            }
        },
        typography: {
            fontFamily: '"Inter", "Roboto", sans-serif',
            h6: { fontWeight: 700 },
        },
        shape: { borderRadius: 12 }
    }), [mode]);

    const menuItems = [
        { text: 'Overview', icon: <DashboardIcon />, path: '/admin-dashboard' },
        { text: 'Create Tutorial', icon: <AddIcon />, path: '/admin-add-tutorial' },
        { text: 'Manage Library', icon: <ViewIcon />, path: '/admin-view-tutorials' },
        { text: 'User Directory', icon: <PeopleIcon />, path: '/admin-view-users' },
    ];

    // Triggered when clicking logout in sidebar
    const handleLogoutClick = () => {
        setOpenLogoutDialog(true);
    };

    // Actual Logout logic
    const handleConfirmLogout = () => {
        setOpenLogoutDialog(false);
        localStorage.removeItem('sarathiAdmin');
        navigate('/');
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <CssBaseline />
                
                {/* --- TOP NAV BAR --- */}
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                        bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(12px)',
                        color: 'text.primary',
                        boxShadow: 'none',
                        borderBottom: `1px solid ${mode === 'light' ? '#e2e8f0' : '#334155'}`,
                    }}
                >
                    {/* ... (Existing Navbar Content) ... */}
                    <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Pages /</Typography>
                            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                                {menuItems.find(item => item.path === location.pathname)?.text || 'Admin'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
                                <IconButton onClick={toggleTheme} color="inherit" sx={{ mx: 1 }}>
                                    {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                            <IconButton size="small">
                                <Badge variant="dot" color="error"><NotificationIcon fontSize="small" /></Badge>
                            </IconButton>
                            <Divider orientation="vertical" flexItem sx={{ mx: 1.5, my: 1.5 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                                    <Typography variant="caption" display="block" sx={{ fontWeight: 700, lineHeight: 1 }}>Admin User</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>System Manager</Typography>
                                </Box>
                                <Avatar sx={{ width: 35, height: 35, bgcolor: 'primary.main', fontSize: '14px', fontWeight: 'bold' }}>AD</Avatar>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* --- SIDEBAR MENU --- */}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: mode === 'light' ? '#0f172a' : '#020617',
                            color: '#94a3b8',
                            borderRight: 'none',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    {/* ... (Existing Sidebar Logo & Navigation Content) ... */}
                    <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ color: 'white', fontWeight: 900 }}>S</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                            Sarathi <span style={{ color: '#818cf8' }}>AI</span>
                        </Typography>
                    </Box>

                    <Box sx={{ px: 2, mt: 2 }}>
                        <Typography variant="caption" sx={{ px: 2, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Navigation</Typography>
                        <List sx={{ mt: 1 }}>
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                        <ListItemButton component={Link} to={item.path} sx={{ borderRadius: '12px', py: 1.2, bgcolor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent', color: isActive ? '#fff' : '#94a3b8', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#fff' }, transition: 'all 0.2s' }}>
                                            <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#818cf8' : 'inherit' }}>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '14px', fontWeight: isActive ? 600 : 500 }} />
                                            {isActive && <Box sx={{ width: 4, height: 18, bgcolor: 'primary.main', borderRadius: 4 }} />}
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>

                    <Box sx={{ mt: 'auto', p: 2, pb: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <ListItemButton
                                onClick={handleLogoutClick}
                                sx={{ borderRadius: '10px', color: '#f87171', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 600, fontSize: '14px' }} />
                            </ListItemButton>
                        </Box>
                    </Box>
                </Drawer>

                {/* --- MAIN CONTENT AREA --- */}
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', transition: 'background-color 0.3s ease', p: { xs: 2, md: 4 }, width: `calc(100% - ${drawerWidth}px)`, mt: '64px', minHeight: '100vh' }}>
                    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>{children}</Box>
                </Box>

                {/* --- LOGOUT CONFIRMATION DIALOG --- */}
                <Dialog
                    open={openLogoutDialog}
                    onClose={() => setOpenLogoutDialog(false)}
                    TransitionComponent={Zoom}
                    PaperProps={{
                        sx: {
                            borderRadius: '20px',
                            padding: '10px',
                            bgcolor: mode === 'light' ? '#fff' : '#1e293b',
                            backgroundImage: 'none'
                        }
                    }}
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
                        <WarningIcon sx={{ color: '#ef4444' }} />
                        Confirm Sign Out
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            Are you sure you want to log out of the Digital Sarathi Admin Console? 
                            You will need to enter your credentials again to access the studio.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button 
                            onClick={() => setOpenLogoutDialog(false)} 
                            sx={{ borderRadius: '10px', color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirmLogout} 
                            variant="contained" 
                            color="error"
                            sx={{ 
                                borderRadius: '10px', 
                                fontWeight: 700, 
                                textTransform: 'none',
                                px: 3,
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' 
                            }}
                        >
                            Sign Out
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}

export default LayOut;