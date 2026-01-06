import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, TextField, Button, Typography, 
    InputAdornment, IconButton, Alert, CircularProgress, Fade, Stack 
} from '@mui/material';
import { 
    Visibility, VisibilityOff, Security, 
    ArrowForward, ShieldMoon, Fingerprint
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './AdminLogin.css';

function AdminLogin() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const formItems = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline();
        
        tl.fromTo(containerRef.current, 
            { opacity: 0, scale: 0.98 }, 
            { opacity: 1, scale: 1, duration: 1, ease: "expo.out" }
        );

        tl.fromTo(leftPanelRef.current, 
            { x: -30, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.8 }, "-=0.6"
        );

        tl.fromTo(formItems.current, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out" }, 
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

        try {
            const res = await axiosInstance.post('users/admin-login', formData);
            if (res.data.isAdmin) {
                localStorage.setItem('sarathiAdmin', JSON.stringify(res.data));
                navigate('/admin-add-tutorial');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unauthorized access detected');
            gsap.to(".login-admin-form-box", { x: 10, duration: 0.1, repeat: 5, yoyo: true });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="login-admin-viewport">
            {/* Minimal Decorative Elements */}
            <div className="login-admin-accent-glow"></div>

            <Box className="login-admin-main-card" ref={containerRef}>
                
                {/* --- LEFT PANEL: IDENTITY --- */}
                <Box className="login-admin-sidebar" ref={leftPanelRef}>
                    <div className="login-admin-mesh-bg"></div>
                    <Box className="login-admin-sidebar-content">
                        <Box className="login-admin-logo-row">
                            <Box className="login-admin-icon-box">
                                <Security sx={{ color: '#fff', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" className="login-admin-brand-name">
                                Sarathi<span className="login-admin-dot">.</span>AI
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 'auto', mb: 'auto' }}>
                            <Typography variant="h3" className="login-admin-hero-text">
                                Command <br /> <strong>Center.</strong>
                            </Typography>
                            <Typography className="login-admin-hero-sub">
                                Professional grade administrative interface for <br />
                                content management and platform intelligence.
                            </Typography>
                        </Box>

                        <Box className="login-admin-security-tag">
                            <Fingerprint sx={{ fontSize: 18, mr: 1, color: '#818cf8' }} />
                            <Typography variant="caption">E2E Encrypted Session</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* --- RIGHT PANEL: AUTHENTICATION --- */}
                <Box className="login-admin-form-section" ref={rightPanelRef}>
                    <Box className="login-admin-form-box">
                        <div ref={el => formItems.current[0] = el}>
                            <Typography variant="h4" className="login-admin-welcome-title">Welcome Back</Typography>
                            <Typography variant="body2" className="login-admin-welcome-sub">
                                Enter your administrative credentials to continue
                            </Typography>
                        </div>

                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" className="login-admin-error-alert">
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        <form onSubmit={handleLogin} className="login-admin-actual-form">
                            <Stack spacing={3}>
                                <div className="login-admin-input-group" ref={el => formItems.current[1] = el}>
                                    <label className="login-admin-label">Work Email</label>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        placeholder="admin@sarathi.ai"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="login-admin-field"
                                        variant="outlined"
                                    />
                                </div>

                                <div className="login-admin-input-group" ref={el => formItems.current[2] = el}>
                                    <label className="login-admin-label">Access Key</label>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="login-admin-field"
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>

                                <div className="login-admin-action-area" ref={el => formItems.current[3] = el}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        disabled={loading}
                                        className={`login-admin-submit-btn ${loading ? 'is-loading' : ''}`}
                                    >
                                        {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (
                                            <>
                                                Initialize Login
                                                <ArrowForward sx={{ ml: 1, fontSize: 18 }} />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Stack>
                        </form>

                        <Typography className="login-admin-footer-text" ref={el => formItems.current[4] = el}>
                            Internal Use Only • © 2025 Digital Sarathi
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminLogin;