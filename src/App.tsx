import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import UserProfile from './pages/UserProfile'
import { SubjectsPage } from './components/SubjectCard'
import BoardSelection from './components/BoardSelection'
import WatchVideo from './pages/WatchVideo'

// Import layout
import MainLayout from './components/MainLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="board-selection" element={<BoardSelection />} />
          <Route path="watch" element={<WatchVideo />} />
        </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App
