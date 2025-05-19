import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const auth = isAuthenticated();
    if (auth) {
      return <>{children}</>;
    }
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;