import React, { useState, useEffect, useRef } from 'react';
import { 
    Container, Typography, Box, Grid, TextField, 
    Button, IconButton, Tooltip, Divider, Alert, CircularProgress,
    Paper, Chip, Fade, Menu, MenuItem, ListItemIcon,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Zoom
} from '@mui/material';
import { 
    EditOutlined, DeleteOutline, Search, LibraryBooksOutlined, 
    AddRounded, FilterList, AutoAwesome, CheckRounded, ClearAll,
    WarningAmberRounded as WarningIcon, DeleteForeverRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './ViewTutorial.css';

const CATEGORIES = ["Smartphone", "Social Media", "Cyber Safety", "Govt Services"];

function ViewTutorial() {
    const [tutorials, setTutorials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); 
    const [isDeleting, setIsDeleting] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        try {
            const res = await axiosInstance.get('tutorials');
            setTutorials(res.data);
            animateCards();
        } catch (err) {
            setError("Failed to sync with the database.");
        } finally {
            setLoading(false);
        }
    };

    const animateCards = () => {
        setTimeout(() => {
            gsap.fromTo(".vt-admin-card", 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: "power2.out" }
            );
        }, 100);
    };

    const handleDeleteClick = (id, title) => {
        setDeleteTarget({ id, title });
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`tutorials/${deleteTarget.id}`);
            setTutorials(prev => prev.filter(t => t._id !== deleteTarget.id));
            setOpenDeleteDialog(false);
            setDeleteTarget(null);
        } catch (err) {
            alert("Error deleting record.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredTutorials = tutorials.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
    const handleFilterClose = (cat) => {
        if (cat) setSelectedCategory(cat);
        setAnchorEl(null);
        animateCards();
    };

    if (loading) return (
        <Box className="vt-loader-container">
            <CircularProgress thickness={5} size={50} sx={{ color: '#6366f1' }} />
            <Typography sx={{ mt: 2, fontWeight: 600, color: 'text.secondary' }}>Loading Library...</Typography>
        </Box>
    );

    return (
        <Box className="vt-admin-viewport">
            <Container maxWidth="xl">
                
                <Box className="vt-admin-header">
                    <Box>
                        <Typography variant="overline" className="vt-admin-overline">
                            <AutoAwesome sx={{ fontSize: 14, mr: 1 }} />
                            Knowledge Management
                        </Typography>
                        <Typography variant="h3" className="vt-admin-title">
                            Tutorial <span className="vt-indigo">Studio</span>
                        </Typography>
                    </Box>
                    <Button 
                        variant="contained" 
                        startIcon={<AddRounded />} 
                        onClick={() => navigate('/admin-add-tutorial')}
                        className="vt-admin-create-btn"
                    >
                        New Tutorial
                    </Button>
                </Box>

                <Paper className="vt-admin-controls" elevation={0}>
                    <Box className="vt-search-wrapper">
                        <Search sx={{ color: 'text.secondary', mr: 1.5 }} />
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{ disableUnderline: true }}
                        />
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1 }} />

                    <Button 
                        onClick={handleFilterClick}
                        startIcon={<FilterList />} 
                        className={`vt-filter-trigger ${selectedCategory !== 'All' ? 'active' : ''}`}
                    >
                        {selectedCategory === 'All' ? 'Filter by Category' : `Category: ${selectedCategory}`}
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => handleFilterClose()}
                        PaperProps={{ className: "vt-filter-menu" }}
                    >
                        <MenuItem onClick={() => handleFilterClose('All')}>
                            <ListItemIcon><ClearAll fontSize="small" /></ListItemIcon>
                            All Tutorials
                        </MenuItem>
                        <Divider />
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} onClick={() => handleFilterClose(cat)}>
                                <ListItemIcon>
                                    {selectedCategory === cat ? <CheckRounded fontSize="small" color="primary"/> : <Box sx={{width: 20}}/>}
                                </ListItemIcon>
                                {cat}
                            </MenuItem>
                        ))}
                    </Menu>
                </Paper>

                {filteredTutorials.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredTutorials.map((tut) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={tut._id}>
                                <Paper className="vt-admin-card" elevation={0}>
                                    <Box className="vt-card-head">
                                        <Chip label={tut.category} size="small" className="vt-cat-chip" />
                                        <Typography variant="caption" className="vt-card-id">#{tut._id.slice(-4)}</Typography>
                                    </Box>

                                    <Typography variant="h6" className="vt-card-title">
                                        {tut.title}
                                    </Typography>
                                    
                                    <Typography variant="body2" className="vt-card-summary">
                                        {tut.description || "No description provided."}
                                    </Typography>

                                    <Box className="vt-card-actions">
                                        <Typography className="vt-step-tag">
                                            <LibraryBooksOutlined sx={{ fontSize: 14 }} />
                                            {tut.steps?.length || 0} Steps
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Edit Content">
                                                <IconButton 
                                                    className="vt-btn-icon vt-edit"
                                                    onClick={() => navigate(`/admin-update-tutorial/${tut._id}`)}
                                                >
                                                    <EditOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Permanently">
                                                <IconButton 
                                                    className="vt-btn-icon vt-delete"
                                                    onClick={() => handleDeleteClick(tut._id, tut.title)}
                                                >
                                                    <DeleteOutline fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box className="vt-no-data">
                        <Typography variant="h6">No results found.</Typography>
                        <Button onClick={() => {setSelectedCategory('All'); setSearchTerm('')}}>Clear All Filters</Button>
                    </Box>
                )}
            </Container>

            <Dialog
                open={openDeleteDialog}
                onClose={() => !isDeleting && setOpenDeleteDialog(false)}
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        borderRadius: '24px',
                        padding: '12px',
                        maxWidth: '400px'
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800, color: '#ef4444' }}>
                    <WarningIcon />
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 500, color: 'text.primary', mb: 1 }}>
                        Are you sure you want to delete:
                    </DialogContentText>
                    <Typography sx={{ 
                        p: 1.5, 
                        bgcolor: 'rgba(239, 68, 68, 0.05)', 
                        borderRadius: '10px', 
                        fontWeight: 700, 
                        color: 'white',
                        border: '1px dashed #f87171' 
                    }}>
                        {deleteTarget?.title}
                    </Typography>
                    <DialogContentText sx={{ mt: 2, fontSize: '13px', color: 'text.secondary' }}>
                        This action is permanent and will remove all steps associated with this guide from the production database.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button 
                        disabled={isDeleting}
                        onClick={() => setOpenDeleteDialog(false)} 
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: 'text.secondary' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete}
                        variant="contained" 
                        color="error"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={18} color="inherit" /> : <DeleteForeverRounded />}
                        sx={{ 
                            borderRadius: '12px', 
                            textTransform: 'none', 
                            fontWeight: 700,
                            px: 3,
                            boxShadow: '0 8px 16px rgba(239, 68, 68, 0.25)'
                        }}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Tutorial'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ViewTutorial;