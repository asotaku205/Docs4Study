import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
          setIsAdmin(parsedUser.role?.toLowerCase() === 'admin');

          try {
            const freshUser = await authService.getCurrentUser();
            setUser(freshUser);
            setIsAdmin(freshUser.role?.toLowerCase() === 'admin');
          } catch (apiError) {
            console.log('Sử dụng dữ liệu cached');
          }
        }
      } catch (error) {
        console.error('Lỗi khởi tạo auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    try {
      authService.signout();
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return {
    user,
    isLoggedIn,
    isAdmin,
    loading,
    logout
  };
};
