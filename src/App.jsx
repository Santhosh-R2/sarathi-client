import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LayOut from './LayOut';
// import AdminDashboard from './pages/AdminDashboard';


import AdminAddTutorial from './AdminAddTutorial';
import AdminLogin from './AdminLogin';
import ViewTutorial from './ViewTutorial';
import AdminUpdateTutorial from './AdminUpdateTutorial';
import ViewUsers from './ViewUsers';
import AdminDashBoard from './AdminDashBoard';
import React from 'react';

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
  return (
    <Router>
      <NavigationHandler />
      <Routes>
        <Route path="/" element={<AdminLogin />} />

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
      </Routes>
    </Router>
  );
}
export default App;