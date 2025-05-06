import { useEffect } from 'react';

const AuthCallback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.hash.substr(1));
        const jwtToken = params.get("id_token") as string;

        sessionStorage.setItem("sui_jwt_token", jwtToken);
        window.location.href = '/notes';
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
