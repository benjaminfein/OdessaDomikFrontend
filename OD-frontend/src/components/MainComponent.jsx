import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from './CalendarComponent';
import GuestCounterComponent from './GuestCounterComponent'
import Cookies from 'js-cookie';
import { getAvailableApartments } from '../services/ApartmentService';

const MainComponent = () => {
  const [myPageClass, setMyPageClass] = useState("my-page");
  const [maxGuests, setMaxGuests] = useState(10);
  const [dates, setDates] = useState({
          checkIn: Cookies.get('checkIn') ?? '',
          checkOut: Cookies.get('checkOut') ?? '',
  });
  const [guestCount, setGuestCount] = useState(
          Number(Cookies.get('guestCount')) || 2
  );

  const navigate = useNavigate();

  useEffect(() => {
    setMyPageClass(window.location.pathname === "/" ? "my-main-page" : "my-page");
  }, []);

  useEffect(() => {
    if (dates.checkIn && dates.checkOut) {
      Cookies.set('checkIn', dates.checkIn, { expires: 1 / 96 });
      Cookies.set('checkOut', dates.checkOut, { expires: 1 / 96 });
      Cookies.set('guestCount', guestCount, { expires: 1 / 96 });
    }
  }, [dates, guestCount]);

  // Логируем даты при их изменении
  useEffect(() => {
    console.log("Сейчас в dates находятся такие даты:", dates); // Логируем текущие даты
  }, [dates]);

  const handleSearch = async () => {
    console.log("Отправляем запрос с параметрами:", { checkIn: dates.checkIn, checkOut: dates.checkOut, guestCount });

    // Если даты НЕ выбраны, передаем только количество гостей в navigate
    if (!dates.checkIn || !dates.checkOut) {
        console.log("Даты не выбраны, ищем все квартиры по кол-ву гостей!");
        navigate('/searching-results', { state: { checkIn: '', checkOut: '', guestCount } });
    } else {
        // Если даты выбраны, передаем и даты, и кол-во гостей в navigate
        console.log("Даты выбраны, ищем квартиры по датам и кол-ву гостей!");
        navigate('/searching-results', { state: { checkIn: dates.checkIn, checkOut: dates.checkOut, guestCount } });
    }
  };

  useEffect(() => {
    const fetchMaxGuests = async () => {
      try {
        console.log("Запрашиваем квартиры с параметрами:", { checkIn: dates.checkIn, checkOut: dates.checkOut, guestCount });

        const apartments = await getAvailableApartments(dates.checkIn || "", dates.checkOut || "", guestCount);
        console.log("response for maxGuests: " + apartments.data)
        if (apartments.data.length > 0) {
          const max = Math.max(...apartments.data.map(a => a.countOfSleepPlaces || 0)); // Находим максимальное значение
          setMaxGuests(max);
        } else {
          setMaxGuests(10); // Значение по умолчанию, если квартир нет
        }
      } catch (error) {
        console.error("Ошибка при получении квартир:", error);
      }
    };

    fetchMaxGuests();
  }, [dates, guestCount]);

  return (
    <div className={myPageClass}>
      <section className="parallax">
        <div className="wrapper-parallax">
          <CalendarComponent dates={dates} setDates={setDates} />
          <GuestCounterComponent guestCount={guestCount} setGuestCount={setGuestCount} maxGuests={maxGuests} />
          <button className='search-button' onClick={handleSearch}>Поиск</button>
        </div>
      </section>
    </div>
  )
}

export default MainComponent