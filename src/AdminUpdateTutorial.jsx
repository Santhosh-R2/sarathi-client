import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, TextField, Button, Typography, Box, 
    MenuItem, IconButton, Grid, Alert, Fade, CircularProgress,
    Paper, Stack, InputBase, Tooltip
} from '@mui/material';
import { 
    Add, DeleteOutline, Save, ArrowBack, 
    AutoAwesome, ListAlt, DragIndicator,
    HistoryEdu
} from '@mui/icons-material';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './AdminUpdateTutorial.css';

function AdminUpdateTutorial() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ title: '', category: 'Smartphone', description: '' });
    const [steps, setSteps] = useState([{ stepNumber: 1, instruction: '' }]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const containerRef = useRef(null);

    useEffect(() => {
        const fetchTutorialData = async () => {
            try {
                const res = await axiosInstance.get(`tutorials/${id}`);
                setFormData({
                    title: res.data.title,
                    category: res.data.category,
                    description: res.data.description
                });
                setSteps(res.data.steps);
                
                gsap.fromTo(containerRef.current, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
                );
            } catch (err) {
                setStatus({ type: 'error', msg: 'Failed to load tutorial data' });
            } finally {
                setLoading(false);
            }
        };
        fetchTutorialData();
    }, [id]);

    const categories = ["Smartphone", "Social Media", "Cyber Safety", "Govt Services"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if(status.msg) setStatus({ type: '', msg: '' });
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
                msg: `Please provide instructions for Step ${lastStep.stepNumber} before adding more.` 
            });
            gsap.to(`.admin-update-tutorials-step-card-${steps.length - 1}`, { 
                x: 10, duration: 0.1, repeat: 3, yoyo: true 
            });
            return;
        }

        const newSteps = [...steps, { stepNumber: steps.length + 1, instruction: '' }];
        setSteps(newSteps);
    };

    const removeStep = (index) => {
        if (steps.length === 1) return;
        setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNumber: i + 1 })));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.description.trim()) {
            setStatus({ type: 'error', msg: 'Title and Description are required fields.' });
            return;
        }

        const hasEmptyStep = steps.some(s => !s.instruction.trim());
        if (hasEmptyStep) {
            setStatus({ type: 'error', msg: 'Workflow steps cannot be empty. Please fill or remove them.' });
            return;
        }

        setUpdating(true);
        setStatus({ type: '', msg: '' });

        try {
            await axiosInstance.put(`tutorials/${id}`, { ...formData, steps });
            setStatus({ type: 'success', msg: 'Tutorial updated successfully!' });
            setTimeout(() => navigate('/admin-view-tutorials'), 1200);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Update failed. Please check your connection.' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress size={50} thickness={5} sx={{ color: '#6366f1' }} />
        </Box>
    );

    return (
        <Box ref={containerRef} className="admin-update-tutorials-container">
            <Box className="admin-update-tutorials-header">
                <Box>
                    <Button 
                        onClick={() => navigate('/admin-view-tutorials')}
                        startIcon={<ArrowBack />}
                        sx={{ mb: 1, textTransform: 'none', color: 'text.secondary', fontWeight: 700 }}
                    >
                        Back to Library
                    </Button>
                    <Typography variant="h4" className="admin-update-tutorials-title">
                        Edit <span className="admin-update-tutorials-gradient-text">Tutorial</span>
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button 
                        onClick={handleUpdate}
                        variant="contained" 
                        className="admin-update-tutorials-save-btn"
                        disabled={updating}
                        startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    >
                        {updating ? 'Saving...' : 'Save Changes'}
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
                    <Stack spacing={3} width={550}>
                        <Paper className="admin-update-tutorials-config-card" elevation={0}>
                            <Box className="admin-update-tutorials-card-label">
                                <HistoryEdu fontSize="small" /> Tutorial Details
                            </Box>
                            <Stack spacing={3} sx={{ mt: 2 }}>
                                <Box>
                                    <label className="admin-update-tutorials-input-label">Title</label>
                                    <TextField
                                        fullWidth
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="admin-update-tutorials-modern-input"
                                    />
                                </Box>
                                <Box>
                                    <label className="admin-update-tutorials-input-label">Category</label>
                                    <TextField
                                        fullWidth
                                        select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="admin-update-tutorials-modern-input"
                                    >
                                        {categories.map((opt) => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box>
                                    <label className="admin-update-tutorials-input-label">Description</label>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="admin-update-tutorials-modern-input"
                                    />
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper className="admin-update-tutorials-info-card" elevation={0}>
                            <AutoAwesome sx={{ color: '#6366f1', mb: 1 }} />
                            <Typography variant="subtitle2" fontWeight="700">Editor Intelligence</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Updates made here will be reflected immediately in the user app.
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={8} width={550}>
                    <Box className="admin-update-tutorials-builder-area">
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" fontWeight="800">
                                <ListAlt sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                                Workflow Builder
                            </Typography>
                            <Typography variant="caption" className="admin-update-tutorials-step-badge">
                                {steps.length} Steps
                            </Typography>
                        </Box>

                        <div className="admin-update-tutorials-steps-list">
                            {steps.map((step, index) => (
                                <Box key={index} className="admin-update-tutorials-step-item">
                                    <div className="admin-update-tutorials-step-rail">
                                        <div className="admin-update-tutorials-step-marker">{step.stepNumber}</div>
                                        {index !== steps.length - 1 && <div className="admin-update-tutorials-step-line" />}
                                    </div>
                                    
                                    <Paper 
                                        className={`admin-update-tutorials-step-card admin-update-tutorials-step-card-${index}`} 
                                        elevation={0}
                                        sx={{ 
                                            border: status.msg && !step.instruction.trim() ? '1px solid #ef4444' : '1px solid #cbd5e1' 
                                        }}
                                    >
                                        <Box display="flex" alignItems="flex-start" gap={2}>
                                            <DragIndicator className="admin-update-tutorials-drag-icon" />
                                            <InputBase
                                                fullWidth
                                                multiline
                                                placeholder="Describe the user action..."
                                                value={step.instruction}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                className="admin-update-tutorials-step-input"
                                            />
                                            <IconButton 
                                                size="small" 
                                                onClick={() => removeStep(index)} 
                                                className="admin-update-tutorials-delete-icon"
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
                            className="admin-update-tutorials-add-btn"
                        >
                            Add Step
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminUpdateTutorial;