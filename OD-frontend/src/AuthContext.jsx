import React, { createContext, useState, useEffect } from 'react';
import { getUser } from './services/UserService'; // Функция для получения пользователя с сервера

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Состояние для пользователя (null = гость)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, залогинен ли пользователь
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data); // Сохраняем данные пользователя
      } catch (error) {
        setUser(null); // Если ошибка, считаем пользователя гостем
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
