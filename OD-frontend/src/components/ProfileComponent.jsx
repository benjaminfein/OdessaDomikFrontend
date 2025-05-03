import React, { useEffect, useState } from 'react';
import { getUser } from '../services/UserService';
import { useTranslation } from 'react-i18next';

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { t, ready } = useTranslation();

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
    return <div>{t('profile.errorMessage')}</div>;
  }

  if (!profileData) {
    return <div>{t('reservationComponent.loading')}</div>;
  }

  const { name, username, email, phoneNumber, dateOfCreated } = profileData;

  if (!ready) return null;

  return (
    <div className="my-page">
      <h2>{t('profile.personalData')}</h2>
      <p className='profile-point'><strong>{t('profile.name')}:</strong> {name || t('profile.notSpecified')}</p>
      <p><strong>{t('profile.username')}:</strong> {username || t('profile.notSpecified')}</p>
      <p><strong>Email:</strong> {email || t('profile.notSpecified')}</p>
      <p><strong>{t('profile.phoneNumber')}:</strong> {phoneNumber || t('profile.notSpecified')}</p>
      <p><strong>{t('profile.createdAt')}:</strong> {dateOfCreated ? new Date(dateOfCreated).toLocaleString() : t('profile.notSpecified')}</p>
    </div>
  );
};

export default ProfileComponent;
