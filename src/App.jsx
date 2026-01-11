import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';

import LayOut from './LayOut';
import AdminAddTutorial from './AdminAddTutorial';
import AdminLogin from './AdminLogin';
import UserLogin from './UserLogin';
import ViewTutorial from './ViewTutorial';
import AdminUpdateTutorial from './AdminUpdateTutorial';
import ViewUsers from './ViewUsers';
import AdminDashBoard from './AdminDashBoard';
import AdminAddQuiz from './AdminAddQuiz';
import AdminViewQuizzes from './AdminViewQuizzes';
import AiChat from './AiChat';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

const NavigationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const unblock = window.addEventListener('popstate', () => {
      navigate(location.pathname, { replace: true });
    });

    return () => {
      window.removeEventListener('popstate', unblock);
    };
  }, [navigate, location]);

  return null;
};

function App() {
  const [mode, setMode] = useState(localStorage.getItem('adminTheme') || 'light');

  useEffect(() => {
    localStorage.setItem('adminTheme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <NavigationHandler />
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/AiChat" element={<AiChat />} />

            <Route path="/admin-add-tutorial" element={
              <LayOut>
                <AdminAddTutorial />
              </LayOut>
            } />

            <Route path="/admin-view-tutorials" element={
              <LayOut>
                <ViewTutorial />
              </LayOut>
            } />
            <Route path="/admin-update-tutorial/:id" element={<LayOut><AdminUpdateTutorial /></LayOut>} />
            <Route path="/admin-view-users" element={<LayOut><ViewUsers /></LayOut>} />
            <Route path="/admin-dashboard" element={<LayOut><AdminDashBoard /></LayOut>} />
            <Route path="/admin-add-quiz" element={<LayOut><AdminAddQuiz /></LayOut>} />
            <Route path="/admin-view-quizzes" element={<LayOut><AdminViewQuizzes /></LayOut>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;