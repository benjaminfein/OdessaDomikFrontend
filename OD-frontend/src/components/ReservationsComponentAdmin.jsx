import React, { useState, useEffect } from 'react'
import { listReservations, getApartment, deleteReservation } from '../services/ApartmentService';
import { getUserById } from '../services/UserService';
import { placeReservationOnHold, cancelReservation, confirmReservation } from '../services/ApartmentService';
import SelectorComponent from './SelectorComponent';
import '../App.css'

const ReservationsComponentAdmin = () => {
  const [Reservations, setReservations] = useState([]);
  const [users, setUsers] = useState({});
  const [apartments, setApartments] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Состояние для модалки
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllReservations();
  }, [])

  function getAllReservations() {
    listReservations().then((response) => {
      setReservations(response.data.reverse()); // Инвертируем массив
    }).catch(error => {
        console.error(error)
    })
  }

  function getApartmentById(apartmentId) {
    if (!apartments[apartmentId]) { // Если квартира еще не загружена
      getApartment(apartmentId)
        .then((response) => {
          setApartments(prevApartments => ({
            ...prevApartments,
            [apartmentId]: response.data
          }));
        })
        .catch(error => {
          console.error(error);
        });
    }
    return apartments[apartmentId]; // Вернёт данные, если они уже загружены
  }  

  function getUserByUserId(userId) {
    if (!users[userId]) { // Загружаем пользователя, только если его ещё нет в `users`
      getUserById(userId)
        .then((response) => {
          setUsers(prevUsers => ({
            ...prevUsers,
            [userId]: response.data
          }));
        })
        .catch(error => {
          console.error(error);
        });
    }
    return users[userId]; // Возвращаем из state, если он уже есть
  }

  function removeReservation(id) {
    deleteReservation(id)
      .then((response) => {
        getAllReservations(); // Обновить список после удаления
        closeConfirmModal(); // Закрыть модалку после удаления
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function openConfirmModal(reservationId, status) {
    setSelectedReservationId(reservationId);
    setNewStatus(status); // Сохраняем новый статус
    setShowConfirmModal(true);
  }

  function closeConfirmModal() {
    setShowConfirmModal(false);
    setSelectedReservationId(null);
  }

  async function updateReservationStatus() {
    if (!selectedReservationId || !newStatus) return;
    
    let updateRequest;
    switch (newStatus) {
      case 'CONFIRMED':
        updateRequest = confirmReservation(selectedReservationId);
        break;
      case 'PENDING':
        updateRequest = placeReservationOnHold(selectedReservationId);
        break;
      case 'CANCELED':
        updateRequest = cancelReservation(selectedReservationId);
        break;
      default:
        return;
    }
  
    try {
      await updateRequest; // ожидаем завершения асинхронной операции
      await getAllReservations(); // если getAllReservations асинхронная
      closeConfirmModal();
    } catch (error) {
      console.error(error);
    }
  }  

  const statusTranslations = {
    CONFIRMED: 'ПОДТВЕРЖДЕНО',
    PENDING: 'В ОБРАБОТКЕ',
    CANCELED: 'ОТМЕНЕНО'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "rgb(183, 255, 183)"; // Зелёный
      case "PENDING":
        return "rgb(255, 255, 184)"; // Жёлтый
      case "CANCELED":
        return "rgb(248, 164, 164)"; // Красный
      default:
        return "#000"; // Чёрный
    }
  };  

  function getStatusClass(status) {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed'; // Класс для подтвержденного
      case 'PENDING':
        return 'status-pending'; // Класс для в обработке
      case 'CANCELED':
        return 'status-canceled'; // Класс для отмененного
      default:
        return '';
    }
  }

  const handleConfirmChange = async () => {
    setIsLoading(true); // Показываем загрузку
    try {
        // Вместо `changeReservationStatus` используй свой метод обновления статуса
        await updateReservationStatus(); 
    } catch (error) {
        console.error("Ошибка при смене статуса:", error);
    } finally {
        setIsLoading(false); // Скрываем индикатор загрузки
    }
};
  
  return (
    <div className='my-page'>
      <div className="admin-table-reservation">
        <h2 className='text-center'>Список броней</h2>
        <table className='my-table text-center'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Квартира</th>{/* ссылка на квартиру */}
                    <th>Даты бронирования</th>
                    <th>Количество гостей</th>
                    <th>Статус</th>{/* Три разных цвета: ЗЕЛЕНЫЙ - бронь подтверждена, ЖЕЛТЫЙ - бронь в обработке, КРАСНЫЙ - бронь отменена */}
                    <th>Информация о пользователе</th>
                    <th>Редактирование</th>
                </tr>
            </thead>
            <tbody>
                {
                    Reservations.map(reservation =>
                        <tr key={reservation.id} className={getStatusClass(reservation.status)}>
                            <td>{reservation.id}</td>
                            <td>
                              <a href={`/${i18n.language}/apartments/apartment-details/${reservation.apartmentId}`}>
                                {getApartmentById(reservation.apartmentId)?.name || "Загрузка..."}
                              </a>
                            </td>
                            <td>{reservation.checkInDate} - {reservation.checkOutDate}</td>
                            <td>{reservation.guestCount}</td>
                            <td>
                              <SelectorComponent 
                                currentStatus={reservation.status}
                                onChange={(newStatus) => openConfirmModal(reservation.id, newStatus)}
                              />
                            </td>
                            <td>
                              <a href={`tel:${getUserByUserId(reservation.userId)?.phoneNumber || "Загрузка..."}`}>
                                {getUserByUserId(reservation.userId)?.phoneNumber || "Загрузка..."}
                              </a>
                            </td>
                            <td>
                                <div className='container-buttons'>
                                    <button className='btn btn-info' onClick={() => updateApartment(apartment.id)}>Обновить</button>
                                    <button 
                                        className='btn btn-danger' onClick={() => openConfirmModal(reservation.id)}
                                        style={{marginLeft: '10px'}}
                                    >Удалить</button>
                                </div>
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
      </div>

      {isLoading && (
        <div className="overlay">
          <div className="loader-container">
            <div className="loader"></div>
            <p className="loading-text">Подождите...</p>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className='reservations-modal-overlay' onClick={closeConfirmModal}>
          <div className='reservations-modal' onClick={(e) => e.stopPropagation()}> {/* Останавливаем событие на самом модальном окне */}
            <h4 style={{marginBottom: "10px"}}>Вы уверены?</h4>
            <button className='btn btn-secondary' style={{marginRight: "20px"}} onClick={closeConfirmModal}>
              Отмена
            </button>
            <button className='btn btn-danger' onClick={() => removeReservation(selectedReservationId)}>
              Удалить
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && newStatus && (
        <div className='reservations-modal-overlay' onClick={closeConfirmModal}>
          <div className='reservations-modal' style={{ width: "500px" }} onClick={(e) => e.stopPropagation()}> {/* Останавливаем событие на модальном окне */}
            <h4>Вы уверены, что хотите внести изменения в данное бронирование?</h4>
            <p>
              <span 
                className={getStatusClass(Reservations.find(r => r.id === selectedReservationId)?.status)} 
                style={{ fontWeight: "bold", backgroundColor: getStatusColor(Reservations.find(r => r.id === selectedReservationId)?.status) }}
              >
                {statusTranslations[Reservations.find(r => r.id === selectedReservationId)?.status]}
              </span>
              →
              <span
                className={getStatusClass(newStatus || "")}
                style={{
                  fontWeight: "bold",
                  backgroundColor: getStatusColor(newStatus || ""),
                }}
              >
                {statusTranslations[newStatus] || "Неизвестно"}
              </span>
            </p>
            <button className='btn btn-secondary' style={{marginRight: "20px"}} onClick={closeConfirmModal}>
              Нет
            </button>
            <button className='btn btn-danger' onClick={handleConfirmChange}>
              Да
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationsComponentAdmin