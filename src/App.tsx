import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import UserProfile from './pages/UserProfile'
import { SubjectsPage } from './components/SubjectCard'
import BoardSelection from './components/BoardSelection'
import AdditionalInfo from './components/AdditionalInfo'
import About from './components/About'
// Import layout
import MainLayout from './components/MainLayout'
import { useEffect, useState } from 'react'
import YoutubePlayer from './pages/YoutubePlayer'
// import VideoProgressDisplay from './components/VideoProgressDisplay'
import Dashboard from './components/Dashboard'
// import Quiz from './pages/Quiz'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for login/logout events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('login', handleAuthChange);
    window.addEventListener('logout', handleAuthChange);

    return () => {
      window.removeEventListener('login', handleAuthChange);
      window.removeEventListener('logout', handleAuthChange);
    };
  }, []);

  if (isLoading) {
    // You can add a loading spinner here if needed
    return <div>Loading...</div>;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes >
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
         

          {/* Protected Routes */}
          <Route path="/profile" element={
           
              <UserProfile />
  
          } />
          <Route path="/subjects" element={
            
              <SubjectsPage />
           
          } />
           <Route path="/about" element={
            
              <About />
            
          } />
          <Route path="/board-selection" element={        
              <BoardSelection />
          } />
          <Route path="/showPlaylist" element={
            
              <YoutubePlayer />
         
          } />
          <Route path="/additional-info" element={
           
              <AdditionalInfo />
            
          } />
          <Route path="/dashboard" element={
         <ProtectedRoute>

           <Dashboard />
         </ProtectedRoute>
            
          } />
          {/* <Route path="/quiz" element={
           
              <Quiz />
            
          } /> */}

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
