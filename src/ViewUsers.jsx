import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, 
    Avatar, Chip, CircularProgress, IconButton, Tooltip, Stack,
    Switch, FormControlLabel
} from '@mui/material';
import { 
    PersonOutline, PhoneOutlined, EmailOutlined, 
    AutoAwesome, VerifiedUserOutlined, BlockOutlined,
    TrendingUpOutlined, Groups
} from '@mui/icons-material';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './ViewUsers.css';

const langColors = {
    "Malayalam": { bg: "rgba(99, 102, 241, 0.1)", text: "#818cf8" },
    "Tamil": { bg: "rgba(244, 63, 94, 0.1)", text: "#fb7185" },
    "Hindi": { bg: "rgba(16, 185, 129, 0.1)", text: "#34d399" },
    "English": { bg: "rgba(168, 85, 247, 0.1)", text: "#c084fc" },
    "Default": { bg: "rgba(148, 163, 184, 0.1)", text: "#94a3b8" }
};

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get('users');
            setUsers(res.data);
            setTimeout(() => {
                gsap.fromTo(".admin-users-row", 
                    { opacity: 0, scale: 0.95, y: 15 },
                    { opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power2.out" }
                );
            }, 100);
        } catch (err) {
            console.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId ? { ...user, isActive: newStatus } : user
                )
            );

            await axiosInstance.patch(`users/status/${userId}`, { isActive: newStatus });
        } catch (err) {
            console.error("Failed to toggle user status", err);
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user._id === userId ? { ...user, isActive: currentStatus } : user
                )
            );
        }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    if (loading) return (
        <Box className="admin-users-loader">
            <CircularProgress size={60} thickness={4} sx={{ color: '#6366f1' }} />
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 800, color: '#f8fafc', letterSpacing: 1 }}>
                LOADING DIRECTORY
            </Typography>
        </Box>
    );

    return (
        <Box className="admin-users-viewport">
            <Container maxWidth="xl">
                <Box className="admin-users-header">
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <div className="admin-users-icon-square"><Groups fontSize="small"/></div>
                            <Typography variant="overline" className="admin-users-overline">SYSTEM MANAGEMENT</Typography>
                        </Box>
                        <Typography variant="h2" className="admin-users-title">User <span className="admin-users-indigo">Ecosystem</span></Typography>
                    </Box>
                    <Box className="admin-users-stats-container">
                        <Box className="admin-users-stat-card">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Groups sx={{ color: '#6366f1', fontSize: 28 }} />
                                <TrendingUpOutlined sx={{ color: '#10b981', fontSize: 18 }} />
                            </Box>
                            <Typography className="stat-value">{users.length}</Typography>
                            <Typography className="stat-label">Total Registered</Typography>
                        </Box>
                        <Box className="admin-users-stat-card active">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <VerifiedUserOutlined sx={{ color: '#10b981', fontSize: 28 }} />
                            </Box>
                            <Typography className="stat-value">{users.filter(u => u.isActive !== false).length}</Typography>
                            <Typography className="stat-label">Active Now</Typography>
                        </Box>
                    </Box>
                </Box>

                <TableContainer component={Paper} className="admin-users-table-paper" elevation={0}>
                    <Table>
                        <TableHead className="admin-users-table-head">
                            <TableRow>
                                <TableCell className="admin-users-h-cell">Identity Profile</TableCell>
                                <TableCell className="admin-users-h-cell">Communication</TableCell>
                                <TableCell className="admin-users-h-cell">Market Preference</TableCell>
                                <TableCell className="admin-users-h-cell">Registration</TableCell>
                                <TableCell className="admin-users-h-cell" align="center">Access Control</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => {
                                const isActive = user.isActive !== false;
                                return (
                                    <TableRow key={user._id} className={`admin-users-row ${!isActive ? 'row-inactive' : ''}`}>
                                        <TableCell>
                                            <Stack direction="row" spacing={2.5} alignItems="center">
                                                <div className="avatar-wrapper">
                                                    <Avatar className={`admin-users-avatar ${!isActive ? 'avatar-disabled' : ''}`}>
                                                        {user.fullName.charAt(0)}
                                                    </Avatar>
                                                    {isActive && <div className="online-indicator" />}
                                                </div>
                                                <Box>
                                                    <Typography className="admin-users-name">
                                                        {user.fullName}
                                                    </Typography>
                                                    <Typography variant="caption" className="admin-users-id-text">
                                                        ID: {user._id.slice(-8).toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="admin-users-contact-item"><PhoneOutlined sx={{ fontSize: 16 }} /> {user.mobile}</Box>
                                            <Box className="admin-users-contact-item muted-info"><EmailOutlined sx={{ fontSize: 16 }} /> {user.email || 'no-email@sarathi.ai'}</Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={user.language || 'English'} 
                                                size="small"
                                                variant="outlined"
                                                sx={{ 
                                                    borderColor: (langColors[user.language] || langColors.Default).text,
                                                    color: (langColors[user.language] || langColors.Default).text,
                                                    background: (langColors[user.language] || langColors.Default).bg,
                                                    fontWeight: 900, fontSize: '10px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="admin-users-date-text">{formatDate(user.createdAt)}</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box className="status-toggle-wrapper">
                                                <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                                                    <Typography variant="caption" sx={{ 
                                                        fontWeight: 900, 
                                                        color: isActive ? '#10b981' : '#64748b',
                                                        letterSpacing: 0.5
                                                    }}>
                                                        {isActive ? 'GRANTED' : 'REVOKED'}
                                                    </Typography>
                                                    <Switch 
                                                        checked={isActive}
                                                        onChange={() => handleToggleStatus(user._id, isActive)}
                                                        className="custom-switch"
                                                    />
                                                </Stack>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
}

export default ViewUsers;