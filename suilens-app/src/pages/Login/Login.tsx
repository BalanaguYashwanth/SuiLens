import { AuthService } from '../../common/zklogin/authService';
import './Login.scss';

const Login = () => {
  const authService = new AuthService();

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Use your Google account to sign in</p>
        <button onClick={() => authService.login()} className="login-button">
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;