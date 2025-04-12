import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext'; // Путь к твоему AuthContext

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  // Показываем загрузочный экран, пока идёт проверка авторизации
  if (loading) return <div>Loading...</div>;

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) return <Navigate to="/login" />;

  // Если есть проверка роли и роль пользователя не совпадает — доступ запрещён
  if (requiredRole && user.User.role !== requiredRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;