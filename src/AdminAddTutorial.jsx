import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, TextField, Button, Typography, MenuItem, IconButton, 
    Grid, Alert, Fade, CircularProgress, Paper, Stack, InputBase, Tooltip 
} from '@mui/material';
import { 
    Add, DeleteOutline, RocketLaunch, ListAlt, 
    AutoAwesome, DragIndicator, InfoOutlined 
} from '@mui/icons-material';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './AdminAddTutorial.css';

function AdminAddTutorial() {
    const [formData, setFormData] = useState({ title: '', category: 'Smartphone', description: '' });
    const [steps, setSteps] = useState([{ stepNumber: 1, instruction: '' }]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    const categories = ["Smartphone", "Social Media", "Cyber Safety", "Govt Services"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if(status.msg) setStatus({ type: '', msg: '' }); // Clear error when typing
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index].instruction = value;
        setSteps(newSteps);
        if(status.msg) setStatus({ type: '', msg: '' }); 
    };

    const addStep = () => {
        const lastStep = steps[steps.length - 1];
        
        if (!lastStep.instruction.trim()) {
            setStatus({ 
                type: 'error', 
                msg: `Please fill in Step ${lastStep.stepNumber} before adding a new one.` 
            });
            
            gsap.to(`.step-card-${steps.length - 1}`, { x: 10, duration: 0.1, repeat: 3, yoyo: true });
            return;
        }

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

        if (!formData.title.trim() || !formData.description.trim()) {
            setStatus({ type: 'error', msg: 'Please provide a Title and Learning Summary.' });
            return;
        }

        const hasEmptyStep = steps.some(s => !s.instruction.trim());
        if (hasEmptyStep) {
            setStatus({ type: 'error', msg: 'One or more steps are empty. Please fill them or remove them.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await axiosInstance.post('tutorials/add', { ...formData, steps });
            setStatus({ type: 'success', msg: 'Tutorial is now live in the library!' });
            
            setFormData({ title: '', category: 'Smartphone', description: '' });
            setSteps([{ stepNumber: 1, instruction: '' }]);
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Server error. Please try again.' });
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
                        className="discard-btn"
                        onClick={() => window.confirm("Discard all changes?") && window.location.reload()}
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
                        {loading ? 'Processing...' : 'Publish to Library'}
                    </Button>
                </Stack>
            </Box>

            {status.msg && (
                <Fade in={!!status.msg}>
                    <Alert 
                        severity={status.type} 
                        variant="filled"
                        className={`status-alert ${status.type}`}
                        sx={{ mb: 4, borderRadius: '12px' }}
                    >
                        {status.msg}
                    </Alert>
                </Fade>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={3} width={550}>
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
                            <Typography variant="subtitle2" fontWeight="700">Editor Intelligence</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Ensure each instruction describes only ONE action for better clarity.
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8} width={550}>
                    <Box className="builder-area" >
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ListAlt sx={{ color: 'primary.main' }} /> Workflow Builder
                            </Typography>
                            <Typography variant="caption" className="step-count-badge">
                                {steps.length} Steps Active
                            </Typography>
                        </Box>

                        <div className="steps-container">
                            {steps.map((step, index) => (
                                <Box key={index} className={`step-wrapper step-card-${index}`}>
                                    <div className="step-number-col">
                                        <div className="step-circle">{step.stepNumber}</div>
                                        {index !== steps.length - 1 && <div className="step-line" />}
                                    </div>
                                    
                                    <Paper 
                                        className="step-card" 
                                        elevation={0}
                                        sx={{ 
                                            border: status.msg && !step.instruction.trim() ? '1px solid #ef4444' : '1px solid rgba(0,0,0,0.08)' 
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <DragIndicator className="drag-handle" />
                                            <InputBase
                                                fullWidth
                                                multiline
                                                placeholder={`Instruction for step ${step.stepNumber}...`}
                                                value={step.instruction}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                className="step-input-base"
                                            />
                                            <IconButton 
                                                size="small" 
                                                onClick={() => removeStep(index)} 
                                                className="delete-icon"
                                                disabled={steps.length === 1}
                                            >
                                                <DeleteOutline fontSize="small" />
                                            </IconButton>
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