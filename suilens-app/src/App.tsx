import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import Project from './pages/Project/Project';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/projects/:projectId/home" element={<Home />} />
        <Route path="/dashboard/:packageId" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
