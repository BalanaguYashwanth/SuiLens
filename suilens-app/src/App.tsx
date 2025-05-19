import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import QueryEditor from './pages/QueryEditor/QueryEditor';
import Dashboard from './pages/Dashboard/Dashboard';
import { PAGE_ROUTES } from './common/constant';
import Layout from './components/Layout/Layout';
import AuthCallback from './components/AuthCallback/AuthCallback';
import Demo from './pages/Demo/Demo';
import { getFullnodeUrl } from "@mysten/sui/client";
import {
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import '@mysten/dapp-kit/dist/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const queryClient = new QueryClient();

const networks = {
  localnet: { url: getFullnodeUrl("localnet") },
  devnet: { url: getFullnodeUrl("devnet") },
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};

function App() {
  const { QUERY_EDITOR, HOME, DASHBOARD, DEMO } = PAGE_ROUTES
  return (
     <Router>
      <Routes>
        <Route 
          path={HOME} 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<AuthCallback />} />
        
        <Route element={<Layout />} >
          <Route
            path={`${DASHBOARD}/:packageAddress`}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path={`${QUERY_EDITOR}/:packageAddress`}
            element={
              <PrivateRoute>
                <QueryEditor />
              </PrivateRoute>
            }
          />
          <Route
            path={`${DEMO}`}
            element={
              <PrivateRoute>
                <QueryClientProvider client={queryClient}>
                  <SuiClientProvider network="testnet" networks={networks}>
                    <WalletProvider autoConnect>
                      <Demo />
                    </WalletProvider>
                  </SuiClientProvider>
                </QueryClientProvider>
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
