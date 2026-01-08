import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, TextField, Button, Typography, MenuItem, IconButton, 
    Grid, Alert, Fade, CircularProgress, Paper, Stack, 
    Radio, RadioGroup, FormControlLabel, Tooltip, Divider, Container,InputBase
} from '@mui/material';
import { 
    AddRounded, DeleteSweepRounded, RocketLaunchRounded, 
    QuizRounded, AutoAwesomeRounded, ArrowBackIosNewRounded,
    ContentPasteSearchRounded, HelpCenterRounded
} from '@mui/icons-material';
import { gsap } from 'gsap';
import axiosInstance from './baseUrl';
import './AdminAddQuiz.css';

function AdminAddQuiz() {
    const [tutorials, setTutorials] = useState([]);
    const [lessonId, setLessonId] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
    ]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const mainRef = useRef(null);

    useEffect(() => {
        const fetchTutorials = async () => {
            const res = await axiosInstance.get('tutorials');
            setTutorials(res.data);
        };
        fetchTutorials();
        gsap.fromTo(mainRef.current, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" });
    }, []);

    const handleQuestionChange = (qIdx, text) => {
        const newQuestions = [...questions];
        newQuestions[qIdx].questionText = text;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIdx, oIdx, val) => {
        const newQuestions = [...questions];
        newQuestions[qIdx].options[oIdx] = val;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    };

    const removeQuestion = (index) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!lessonId) return setStatus({ type: 'error', msg: 'Select a parent tutorial.' });

        const formattedQuestions = questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.options[q.correctAnswerIndex], // Pick string from index
            type: 'radio'
        }));

        setLoading(true);
        try {
            await axiosInstance.post('assessment/admin/add-quiz', { lessonId, questions: formattedQuestions });
            setStatus({ type: 'success', msg: 'Quiz module successfully integrated.' });
            setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Deployment error. Please retry.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="quiz-canvas-viewport" ref={mainRef}>
            <Container maxWidth="md">
                
                {/* --- CANVAS HEADER --- */}
                <Box className="quiz-canvas-header">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <div className="quiz-canvas-icon-wrap"><QuizRounded /></div>
                        <Box>
                            <Typography variant="h4" className="quiz-canvas-title">Quiz Builder</Typography>
                            <Typography variant="body2" color="text.secondary">Step-by-step assessment creator</Typography>
                        </Box>
                    </Stack>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        className="quiz-canvas-deploy-btn"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RocketLaunchRounded />}
                    >
                        Deploy Quiz
                    </Button>
                </Box>

                {status.msg && (
                    <Fade in={!!status.msg}>
                        <Alert severity={status.type} variant="outlined" className="quiz-canvas-alert">{status.msg}</Alert>
                    </Fade>
                )}

                {/* --- CONFIGURATION BLOCK --- */}
                <Paper className="quiz-canvas-setup-card" elevation={0}>
                    <Stack spacing={3}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <ContentPasteSearchRounded color="primary" />
                            <Typography variant="h6" fontWeight="800">Target Content</Typography>
                        </Box>
                        <TextField
                            select fullWidth
                            label="Link this quiz to a tutorial"
                            value={lessonId}
                            onChange={(e) => setLessonId(e.target.value)}
                            className="quiz-canvas-input"
                        >
                            {tutorials.map((tut) => (
                                <MenuItem key={tut._id} value={tut._id}>{tut.title}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Paper>

                {/* --- QUESTION CANVAS --- */}
                <Box className="quiz-canvas-questions">
                    {questions.map((q, qIdx) => (
                        <Paper key={qIdx} className="quiz-canvas-q-card" elevation={0}>
                            <Box className="quiz-canvas-q-header">
                                <Box className="quiz-canvas-q-number">Question {qIdx + 1}</Box>
                                <IconButton onClick={() => removeQuestion(qIdx)} disabled={questions.length === 1}>
                                    <DeleteSweepRounded color="error" />
                                </IconButton>
                            </Box>

                            <TextField
                                fullWidth multiline
                                placeholder="What would you like to ask the user?"
                                variant="standard"
                                className="quiz-canvas-question-input"
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                                InputProps={{ disableUnderline: true }}
                            />

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="caption" className="quiz-canvas-sublabel">Define Options & Select Correct Answer</Typography>
                            
                            <RadioGroup 
                                value={q.correctAnswerIndex}
                                onChange={(e) => {
                                    const newQ = [...questions];
                                    newQ[qIdx].correctAnswerIndex = parseInt(e.target.value);
                                    setQuestions(newQ);
                                }}
                            >
                                <Grid container spacing={2} mt={1}>
                                    {q.options.map((opt, oIdx) => (
                                        <Grid item xs={12} sm={6} key={oIdx}>
                                            <Box className={`quiz-canvas-opt-box ${q.correctAnswerIndex === oIdx ? 'selected' : ''}`}>
                                                <FormControlLabel
                                                    value={oIdx}
                                                    control={<Radio color="primary" />}
                                                    label=""
                                                    sx={{ m: 0 }}
                                                />
                                                <InputBase
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    fullWidth
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                                    className="quiz-canvas-opt-text"
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </Paper>
                    ))}

                    <Button 
                        fullWidth 
                        onClick={addQuestion}
                        className="quiz-canvas-add-btn"
                        startIcon={<AddRounded />}
                    >
                        Append Another Question
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default AdminAddQuiz;