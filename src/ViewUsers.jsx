import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, 
    Avatar, Chip, CircularProgress, IconButton, Tooltip, Stack
} from '@mui/material';
import { 
    PersonOutline, PhoneOutlined, EmailOutlined, 
    CalendarMonthOutlined, SchoolOutlined, AutoAwesome,
    ManageAccountsOutlined, DeleteOutline
} from '@mui/icons-material';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './ViewUsers.css';

const langColors = {
    "Malayalam": { bg: "rgba(3, 105, 161, 0.15)", text: "#0369a1" },
    "Tamil": { bg: "rgba(185, 28, 28, 0.15)", text: "#b91c1c" },
    "Hindi": { bg: "rgba(21, 128, 61, 0.15)", text: "#15803d" },
    "English": { bg: "rgba(109, 40, 217, 0.15)", text: "#6d28d9" },
    "Default": { bg: "rgba(100, 116, 139, 0.15)", text: "#64748b" }
};

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get('users');
                setUsers(res.data);
                setTimeout(() => {
                    gsap.fromTo(".admin-users-row", 
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 }
                    );
                }, 100);
            } catch (err) {
                console.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

    const getLiteracyStyle = (level) => {
        if (level?.includes('Senior')) return { color: '#f59e0b', label: 'Senior Mode' };
        if (level?.includes('Beginner')) return { color: '#10b981', label: 'Beginner' };
        return { color: '#6366f1', label: level || 'Standard' };
    };

    if (loading) return (
        <Box className="admin-users-loader">
            <CircularProgress size={50} thickness={5} sx={{ color: '#6366f1' }} />
        </Box>
    );

    return (
        <Box className="admin-users-viewport">
            <Container maxWidth="xl">
                <Box className="admin-users-header">
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <div className="admin-users-icon-square"><PersonOutline fontSize="small"/></div>
                            <Typography variant="overline" className="admin-users-overline">Learner Insights</Typography>
                        </Box>
                        <Typography variant="h3" className="admin-users-title">User <span className="admin-users-indigo">Directory</span></Typography>
                    </Box>
                    <Box className="admin-users-stats">
                        <Typography variant="h4" fontWeight="900">{users.length}</Typography>
                        <Typography variant="caption" fontWeight="700">TOTAL REGISTERED</Typography>
                    </Box>
                </Box>

                <TableContainer component={Paper} className="admin-users-table-paper" elevation={0}>
                    <Table>
                        <TableHead className="admin-users-table-head">
                            <TableRow>
                                <TableCell className="admin-users-h-cell">Learner Profile</TableCell>
                                <TableCell className="admin-users-h-cell">Contact Identity</TableCell>
                                <TableCell className="admin-users-h-cell">Language</TableCell>
                                <TableCell className="admin-users-h-cell">Literacy Level</TableCell>
                                <TableCell className="admin-users-h-cell">Joined Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => {
                                const litStyle = getLiteracyStyle(user.literacyLevel);
                                return (
                                    <TableRow key={user._id} className="admin-users-row">
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar className="admin-users-avatar">{user.fullName.charAt(0)}</Avatar>
                                                <Box>
                                                    <Typography className="admin-users-name">{user.fullName}</Typography>
                                                    <Typography variant="caption" className="admin-users-id-text">UID-{user._id.slice(-5).toUpperCase()}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Box className="admin-users-contact-item"><PhoneOutlined sx={{ fontSize: 14 }} /> {user.mobile}</Box>
                                            <Box className="admin-users-contact-item muted-text"><EmailOutlined sx={{ fontSize: 14 }} /> {user.email || 'N/A'}</Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={user.language || 'English'} 
                                                size="small"
                                                sx={{ 
                                                    bgcolor: (langColors[user.language] || langColors.Default).bg,
                                                    color: (langColors[user.language] || langColors.Default).text,
                                                    fontWeight: 800, borderRadius: '6px'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box className="literacy-cell">
                                                <SchoolOutlined sx={{ fontSize: 16, color: litStyle.color, mr: 1 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: litStyle.color }}>
                                                    {litStyle.label}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="admin-users-date-text">{formatDate(user.createdAt)}</Typography>
                                        </TableCell>
                                        {/* <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Settings">
                                                    <IconButton size="small" className="admin-users-action-btn view">
                                                        <ManageAccountsOutlined fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" className="admin-users-action-btn delete">
                                                        <DeleteOutline fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell> */}
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