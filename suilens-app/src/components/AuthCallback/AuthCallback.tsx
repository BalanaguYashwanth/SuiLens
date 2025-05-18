import { useEffect } from 'react';
import { AuthService } from '../../common/zklogin/authService';


const AuthCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.hash.substr(1));
        const jwtToken = params.get("id_token") as string;

        sessionStorage.setItem("sui_jwt_token", jwtToken);

        await AuthService.finalizeLoginAndCreateUserIfNeeded();

        window.location.href = '/home';
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    };

    handleCallback();
  }, []);

  return (
    <div>
      <p>Processing callback...</p>
    </div>
  );
};

export default AuthCallback;
