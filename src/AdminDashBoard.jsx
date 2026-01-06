import React, { useState, useEffect } from 'react';
import { 
    Box, Grid, Paper, Typography, Container, 
    CircularProgress, Card, CardContent, Avatar, Alert, Stack, Fade
} from '@mui/material';
import { 
    PeopleAltOutlined, AutoStoriesOutlined, ForumOutlined, 
    LanguageOutlined, TrendingUpOutlined, InsightsOutlined
} from '@mui/icons-material';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './AdminDashBoard.css';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box className="custom-chart-tooltip">
                <Typography className="tooltip-label">{label}</Typography>
                <Typography className="tooltip-value">
                    <span>Learners:</span> {payload[0].value}
                </Typography>
            </Box>
        );
    }
    return null;
};

function AdminDashBoard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get('users/stats');
                setData(res.data);
                
                setTimeout(() => {
                    const tl = gsap.timeline();
                    tl.fromTo(".admin-dash-kpi", 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }
                    );
                    tl.fromTo(".admin-dash-chart-box", 
                        { opacity: 0, scale: 0.98 }, 
                        { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }, "-=0.3"
                    );
                }, 100);
            } catch (err) {
                setError("Real-time synchronization failed. Displaying cached data.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <Box className="admin-dash-loader">
            <CircularProgress size={60} thickness={5} sx={{ color: '#6366f1' }} />
            <Typography sx={{ mt: 2, fontWeight: 700, letterSpacing: 1 }}>ANALYZING DATA...</Typography>
        </Box>
    );

    const kpiCards = [
        { label: 'Active Learners', value: data?.totalUsers, icon: <PeopleAltOutlined />, color: '#6366f1' },
        { label: 'Total Tutorials', value: data?.totalTutorials, icon: <AutoStoriesOutlined />, color: '#10b981' },
        { label: 'AI Conversations', value: data?.totalChats, icon: <ForumOutlined />, color: '#f59e0b' }
    ];

    return (
        <Box className="admin-dash-viewport">
            <Container maxWidth="xl">
                
                <Box className="admin-dash-header">
                    <Box>
                        <Box className="admin-dash-badge">
                            <InsightsOutlined fontSize="small" />
                            <span>System Overview</span>
                        </Box>
                        <Typography variant="h3" className="admin-dash-title">
                            Platform <span className="text-indigo">Intelligence</span>
                        </Typography>
                        <Typography variant="body1" className="admin-dash-subtitle">
                            Monitor user growth, engagement, and language metrics in real-time.
                        </Typography>
                    </Box>
                </Box>

                {error && <Fade in><Alert severity="warning" sx={{ mb: 4, borderRadius: '12px' }}>{error}</Alert></Fade>}

                <Grid container spacing={12} sx={{ mb: 4 , mt: 3 }}>
                    {kpiCards.map((stat, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card className="admin-dash-kpi">
                                <CardContent className="admin-dash-kpi-content">
                                    <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color }} className="admin-dash-avatar">
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography className="admin-dash-kpi-label">{stat.label}</Typography>
                                        <Typography variant="h4" className="admin-dash-kpi-value">
                                            {stat.value?.toLocaleString() || 0}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <div className="admin-dash-kpi-border" style={{ backgroundColor: stat.color }}></div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={12} lg={7} width={540}>
                        <Paper className="admin-dash-chart-box" elevation={0}>
                            <Box className="admin-dash-chart-header">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TrendingUpOutlined sx={{ color: '#6366f1' }} />
                                    <Typography variant="h6" fontWeight="800">Enrollment Growth</Typography>
                                </Stack>
                            </Box>
                            <Box className="admin-dash-chart-wrapper">
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={data?.growthData || []}>
                                        <defs>
                                            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94a3b8', fontSize: 12}} 
                                            dy={10} 
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94a3b8', fontSize: 12}} 
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="users" 
                                            stroke="#6366f1" 
                                            strokeWidth={4} 
                                            fillOpacity={1} 
                                            fill="url(#growthGradient)" 
                                            activeDot={{ r: 8, strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} lg={5} width={540}>
                        <Paper className="admin-dash-chart-box" elevation={0}>
                            <Box className="admin-dash-chart-header">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LanguageOutlined sx={{ color: '#10b981' }} />
                                    <Typography variant="h6" fontWeight="800">Language Reach</Typography>
                                </Stack>
                            </Box>
                            <Box className="admin-dash-pie-wrapper">
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={data?.languageData || []}
                                            innerRadius={80}
                                            outerRadius={140}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {(data?.languageData || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} 
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                                
                                <Grid container spacing={2} className="admin-dash-pie-legend-grid">
                                    {(data?.languageData || []).map((entry, i) => (
                                        <Grid item xs={6} key={i}>
                                            <Box className="legend-item-v2">
                                                <div className="legend-color-bar" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></div>
                                                <Box>
                                                    <Typography className="legend-name">{entry.name}</Typography>
                                                    <Typography className="legend-val">{entry.value} users</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AdminDashBoard;