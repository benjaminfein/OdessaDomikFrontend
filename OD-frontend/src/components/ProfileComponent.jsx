import React, { useEffect, useState } from 'react';
import { getUser } from '../services/UserService';

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getUser();
        setProfileData(response.data.User); // Берем данные из объекта User
      } catch (error) {
        console.error("Ошибка при получении профиля:", error);
        setErrorMessage("Не удалось загрузить данные профиля. Попробуйте позже.");
      }
    };

    fetchProfileData();
  }, []);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!profileData) {
    return <div>Загрузка...</div>;
  }

  const { name, username, email, phoneNumber, dateOfCreated } = profileData;

  return (
    <div className="my-page">
      <h2>Персональные данные</h2>
      <p className='profile-point'><strong>Имя:</strong> {name || "Не указано"}</p>
      <p><strong>Имя пользователя:</strong> {username || "Не указано"}</p>
      <p><strong>Email:</strong> {email || "Не указано"}</p>
      <p><strong>Номер телефона:</strong> {phoneNumber || "Не указано"}</p>
      <p><strong>Дата создания профиля:</strong> {new Date(dateOfCreated).toLocaleString() || "Не указано"}</p>
    </div>
  );
};

export default ProfileComponent;
