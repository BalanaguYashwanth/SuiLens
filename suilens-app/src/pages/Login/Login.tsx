import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../common/api.services';
import Loader from '../../components/Loader/Loader';
import './Login.scss';
import SuiZkLogin from '../../components/SuiZkLogin/SuiZkLogin';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const token = credentialResponse.credential;
      document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      await createUser(token);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onError = () => {
    console.error('Login Failed');
  };

  if (isLoading) return <Loader />;

  return (
    <div className="login-page">
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Use your Google account to sign in</p>
        <div className="google-button-wrapper">
          <SuiZkLogin name="SUI zkLogin Notes" coverImg={'https://uploads.servicebell.com/cdn-cgi/image/width=320,height=320,f=auto/widget-org-logos/770540926.533a796cc2644e93a2bb3dec2b40c3f2.png'} />
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Login;
