import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import Project from './pages/Project/Project';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardV2 from './pages/DashboardV2/DashboardV2';

function App() {
  return (
    <Router>
      <Routes>
        {/* #TODO - make this as dashboard */}
        <Route path="/dashboard-v2" element={<DashboardV2 />} />
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Project />} />
        {/* #TODO - make this dashboard as editor */}
        <Route path="/dashboard/:packageId" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
