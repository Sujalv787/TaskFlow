import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { loginUser, registerUser, logout, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error, isAuthenticated, users } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (credentials) => {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard');
        return { success: true };
      }
      return { success: false, error: result.payload };
    },
    [dispatch, navigate]
  );

  const register = useCallback(
    async (userData) => {
      const result = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(result)) {
        navigate('/dashboard');
        return { success: true };
      }
      return { success: false, error: result.payload };
    },
    [dispatch, navigate]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    users,
    login,
    register,
    logout: logoutUser,
    resetError,
  };
};
