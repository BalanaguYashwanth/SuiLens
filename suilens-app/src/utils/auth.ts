export const isAuthenticated = (): boolean => {
  const token = sessionStorage.getItem('sui_jwt_token');
  return token !== null && token !== 'null';
};
