import React, { useState, useEffect, useRef } from 'react';
import {
    Box, TextField, Button, Typography,
    InputAdornment, IconButton, Alert, CircularProgress, Fade, Stack, Paper,
    useTheme, alpha
} from '@mui/material';
import {
    Visibility, VisibilityOff, LockOutlined,
    ArrowForward, SchoolOutlined, PersonOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';

function UserLogin() {
    const theme = useTheme();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const containerRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(containerRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );

        tl.fromTo(".login-field",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
            "-=0.4"
        );
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.identifier || !formData.password) {
            setError("Please provide both identifier and password.");
            setLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.post('users/login', formData);
            if (res.data.user) {
                localStorage.setItem('sarathiUser', JSON.stringify(res.data.user));
                navigate('/AiChat');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            gsap.to(formRef.current, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 2,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Abstract Shapes */}
            <Box sx={{
                position: 'absolute', top: '-10%', left: '-10%',
                width: '600px', height: '600px',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
                zIndex: 0, borderRadius: '50%'
            }} />
            <Box sx={{
                position: 'absolute', bottom: '-10%', right: '-10%',
                width: '500px', height: '500px',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                zIndex: 0, borderRadius: '50%'
            }} />

            <Paper
                ref={containerRef}
                elevation={theme.palette.mode === 'dark' ? 4 : 2}
                sx={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: 450,
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    zIndex: 1,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    flexDirection: 'column'
                }}
            >
                <Box sx={{
                    p: 4, pb: 2,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0)} 100%)`
                }}>
                    <Box sx={{
                        width: 60, height: 60, borderRadius: '20px',
                        bgcolor: 'primary.main', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 2, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)'
                    }}>
                        <SchoolOutlined fontSize="large" />
                    </Box>
                    <Typography variant="h5" fontWeight="800" sx={{ mb: 0.5 }}>Learner Portal</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back to your learning journey
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }} ref={formRef}>
                    {error && (
                        <Fade in>
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} variant="outlined">
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    <form onSubmit={handleLogin}>
                        <Stack spacing={2.5}>
                            <Box className="login-field">
                                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary' }}>
                                    EMAIL OR MOBILE
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="identifier"
                                    placeholder="student@example.com"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PersonOutline color="action" /></InputAdornment>,
                                        sx: { bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.05)' }
                                    }}
                                />
                            </Box>

                            <Box className="login-field">
                                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block', color: 'text.secondary' }}>
                                    PASSWORD
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LockOutlined color="action" /></InputAdornment>,
                                        sx: { bgcolor: theme.palette.mode === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.05)' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>

                            <Box className="login-field" sx={{ pt: 1 }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        boxShadow: theme.shadows[4]
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : (
                                        <>
                                            Start Learning
                                            <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
                                        </>
                                    )}
                                </Button>
                            </Box>
                        </Stack>
                    </form>

                    <Typography className="login-field" variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                        Need an account? Contact your administrator.
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default UserLogin;
