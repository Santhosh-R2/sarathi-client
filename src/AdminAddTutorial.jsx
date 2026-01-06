import React, { useState, useEffect, useRef } from 'react';
import { 
    Container, TextField, Button, Typography, Box, 
    MenuItem, IconButton, Grid, Alert, Fade, CircularProgress,
    Paper, Stack, InputBase, Tooltip, useTheme
} from '@mui/material';
import { 
    Add, DeleteOutline, Publish, AutoAwesome, 
    RocketLaunch, ListAlt, Description, 
    DragIndicator, InfoOutlined
} from '@mui/icons-material';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './AdminAddTutorial.css';

function AdminAddTutorial() {
    const theme = useTheme();
    const [formData, setFormData] = useState({ title: '', category: 'Smartphone', description: '' });
    const [steps, setSteps] = useState([{ stepNumber: 1, instruction: '' }]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const containerRef = useRef(null);
    const stepsRef = useRef([]);

    useEffect(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    const categories = ["Smartphone", "Social Media", "Cyber Safety", "Govt Services"];

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index].instruction = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        const newSteps = [...steps, { stepNumber: steps.length + 1, instruction: '' }];
        setSteps(newSteps);
        setTimeout(() => {
            gsap.from(`.step-card-${newSteps.length - 1}`, {
                opacity: 0, scale: 0.9, duration: 0.3
            });
        }, 10);
    };

    const removeStep = (index) => {
        if (steps.length === 1) return;
        setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            await axiosInstance.post('tutorials/add', { ...formData, steps });
            setStatus({ type: 'success', msg: 'Tutorial is now live in the library!' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to publish. Please check your connection.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box ref={containerRef} className="studio-container">
            <Box className="studio-header">
                <Box>
                    <Typography variant="h4" className="studio-title">
                        Create <span className="gradient-text">New Tutorial</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Draft and deploy intelligent step-by-step guides for users.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        sx={{ borderRadius: '12px', textTransform: 'none' }}
                        onClick={() => window.location.reload()}
                    >
                        Discard
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        variant="contained" 
                        className="publish-btn"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RocketLaunch />}
                    >
                        Publish to Library
                    </Button>
                </Stack>
            </Box>

            {status.msg && (
                <Fade in={!!status.msg}>
                    <Alert 
                        severity={status.type} 
                        variant="filled"
                        sx={{ mb: 4, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                        {status.msg}
                    </Alert>
                </Fade>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <Paper className="config-card" elevation={0}>
                            <Box className="card-label">
                                <InfoOutlined fontSize="small" /> Basic Information
                            </Box>
                            <Stack spacing={3} sx={{ mt: 2 }}>
                                <Box>
                                    <label className="custom-label">Tutorial Title</label>
                                    <TextField
                                        fullWidth
                                        name="title"
                                        placeholder="e.g., Setting up Dual-SIM"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="modern-input"
                                    />
                                </Box>
                                <Box>
                                    <label className="custom-label">Category</label>
                                    <TextField
                                        fullWidth
                                        select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="modern-input"
                                    >
                                        {categories.map((opt) => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box>
                                    <label className="custom-label">Learning Summary</label>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="description"
                                        placeholder="What will users learn in this guide?"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="modern-input"
                                    />
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper className="info-tip-card" elevation={0}>
                            <AutoAwesome sx={{ color: '#6366f1', mb: 1 }} />
                            <Typography variant="subtitle2" fontWeight="700">Pro Tip</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Keep steps concise. Tutorials with 5-8 steps have the highest completion rate among senior users.
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8} width={500}>
                    <Box className="builder-area">
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ListAlt sx={{ color: 'primary.main' }} /> Workflow Builder
                            </Typography>
                            <Typography variant="caption" className="step-count-badge">
                                {steps.length} {steps.length === 1 ? 'Step' : 'Steps'} Total
                            </Typography>
                        </Box>

                        <div className="steps-container">
                            {steps.map((step, index) => (
                                <Box key={index} className={`step-wrapper step-card-${index}`}>
                                    <div className="step-number-col">
                                        <div className="step-circle">{step.stepNumber}</div>
                                        {index !== steps.length - 1 && <div className="step-line" />}
                                    </div>
                                    
                                    <Paper className="step-card" elevation={0}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <DragIndicator className="drag-handle" />
                                            <InputBase
                                                fullWidth
                                                multiline
                                                placeholder={`What happens in step ${step.stepNumber}?`}
                                                value={step.instruction}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                className="step-input-base"
                                            />
                                            <Tooltip title="Remove Step">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => removeStep(index)} 
                                                    className="delete-icon"
                                                    disabled={steps.length === 1}
                                                >
                                                    <DeleteOutline fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Paper>
                                </Box>
                            ))}
                        </div>

                        <Button 
                            fullWidth
                            startIcon={<Add />} 
                            onClick={addStep}
                            className="add-step-btn"
                        >
                            Append New Instruction
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminAddTutorial;