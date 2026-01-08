import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Container, Grid, Paper, CircularProgress, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, Chip, IconButton, Stack, Card, CardContent, Divider, Fade
} from '@mui/material';
import { 
    QuizOutlined, PeopleAltOutlined, AssessmentOutlined, 
    ChevronRightRounded, AnalyticsOutlined, StarsRounded,
    TimerOutlined
} from '@mui/icons-material';
import axiosInstance from './baseUrl';
import './AdminViewQuizzes.css';

function AdminViewQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await axiosInstance.get('tutorials'); 
            setQuizzes(res.data);
        } catch (err) {
            console.error("Error fetching quizzes");
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizDetails = async (lessonId) => {
        setDetailsLoading(true);
        setSelectedQuiz(quizzes.find(q => q._id === lessonId));
        try {
            const res = await axiosInstance.get(`assessment/results/${lessonId}`);
            console.log(res);
            
            setResults(res.data);
        } catch (err) {
            console.log(err);
            
            setResults([]);
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) return (
        <Box className="quiz-view-loader">
            <CircularProgress thickness={5} size={50} sx={{ color: '#6366f1' }} />
            <Typography sx={{ mt: 2, fontWeight: 700 }}>Initializing Analytics...</Typography>
        </Box>
    );

    return (
        <Box className="quiz-view-viewport">
            <Container maxWidth="xl">
                <Box className="quiz-view-header">
                    <Box>
                        <Typography variant="overline" className="quiz-view-overline">
                            <AnalyticsOutlined sx={{ fontSize: 16, mr: 1 }} />
                            Performance Tracking
                        </Typography>
                        <Typography variant="h3" className="quiz-view-title">Quiz <span className="text-indigo">Insights</span></Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} width={400}>
                        <Typography variant="subtitle2" className="quiz-view-section-label">Select Tutorial Quiz</Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {quizzes.map((quiz) => (
                                <Paper 
                                    key={quiz._id} 
                                    className={`quiz-list-item ${selectedQuiz?._id === quiz._id ? 'active' : ''}`}
                                    onClick={() => fetchQuizDetails(quiz._id)}
                                    elevation={0}
                                >
                                    <Box>
                                        <Typography className="quiz-item-title">{quiz.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{quiz.category}</Typography>
                                    </Box>
                                    <ChevronRightRounded className="quiz-item-arrow" />
                                </Paper>
                            ))}
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={8} >
                        {!selectedQuiz ? (
                            <Box className="quiz-view-empty">
                                <AssessmentOutlined sx={{ fontSize: 80, opacity: 0.1, mb: 2 }} />
                                <Typography variant="h6">Select a quiz to view data</Typography>
                            </Box>
                        ) : (
                            <Fade in={true}>
                                <Box>
                                    <Grid container spacing={12} sx={{ mb: 4 }} >
                                        <Grid item xs={12} sm={4}>
                                            <Card className="quiz-stat-card">
                                                <Avatar className="stat-avatar indigo"><PeopleAltOutlined /></Avatar>
                                                <Box>
                                                    <Typography className="stat-val">{results.length}</Typography>
                                                    <Typography className="stat-lab">Attempts</Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Card className="quiz-stat-card">
                                                <Avatar className="stat-avatar amber"><StarsRounded /></Avatar>
                                                <Box>
                                                    <Typography className="stat-val">
                                                        {results.length > 0 
                                                            ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1) 
                                                            : 0}
                                                    </Typography>
                                                    <Typography className="stat-lab">Avg Score</Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Card className="quiz-stat-card">
                                                <Avatar className="stat-avatar emerald"><TimerOutlined /></Avatar>
                                                <Box>
                                                    <Typography className="stat-val">Active</Typography>
                                                    <Typography className="stat-lab">Status</Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    {/* User Report Table */}
                                    <Typography variant="h6" fontWeight="800" sx={{ mb: 2 }}>Attended User Report</Typography>
                                    <TableContainer component={Paper} className="quiz-report-table" elevation={0}>
                                        {detailsLoading ? (
                                            <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={30} /></Box>
                                        ) : (
                                            <Table>
                                                <TableHead className="quiz-report-table-head">
                                                    <TableRow>
                                                        <TableCell className="report-h-cell">User</TableCell>
                                                        <TableCell className="report-h-cell">Score</TableCell>
                                                        <TableCell className="report-h-cell">Mistakes Made</TableCell>
                                                        <TableCell className="report-h-cell">Date</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {results.length === 0 ? (
                                                        <TableRow><TableCell colSpan={4} align="center">No users have attended this quiz yet.</TableCell></TableRow>
                                                    ) : (
                                                        results.map((row) => (
                                                            <TableRow key={row._id} className="report-row">
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                                        <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: 'primary.main' }}>
                                                                            {row.userId?.fullName?.charAt(0) || 'U'}
                                                                        </Avatar>
                                                                        <Typography variant="body2" fontWeight="700">{row.userId?.fullName || 'Unknown User'}</Typography>
                                                                    </Stack>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip 
                                                                        label={`${row.score}/${row.totalQuestions}`} 
                                                                        size="small" 
                                                                        className={`score-chip ${row.score === row.totalQuestions ? 'perfect' : ''}`}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                                                                        {row.mistakes.length} Questions failed
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="caption">{new Date(row.createdAt).toLocaleDateString('en-GB')}</Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </TableContainer>
                                </Box>
                            </Fade>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AdminViewQuizzes;