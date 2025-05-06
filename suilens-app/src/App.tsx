import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import QueryEditor from './pages/QueryEditor/QueryEditor';
import Dashboard from './pages/Dashboard/Dashboard';
import { PAGE_ROUTES } from './common/constant';
import Layout from './components/Layout/Layout';
import AuthCallback from './components/AuthCallback/AuthCallback';
import './App.css';

function App() {
  const {QUERY_EDITOR, HOME, DASHBOARD} = PAGE_ROUTES
  return (
    <Router>
      <Routes>
        <Route path={HOME} element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<AuthCallback />} />
        <Route element={<Layout />} >
          <Route path={`${DASHBOARD}/:packageAddress`} element={<Dashboard />} />  
          <Route path={`${QUERY_EDITOR}/:packageAddress`} element={<QueryEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
