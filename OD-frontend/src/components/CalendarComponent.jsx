import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import '../../node_modules/react-calendar/src/Calendar.css';
import { useTranslation } from 'react-i18next';

function CalendarComponent({ dates, setDates }) {
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [isNavigating, setIsNavigating] = useState(false);
  const calendarRef = useRef(null);
  const { t, ready } = useTranslation();
  const { i18n } = useTranslation();

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        document.querySelector(".calendar-component")?.classList.remove("show");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function translateDate(dateString) {
    let translated = dateString;

    // Переклад днів
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
        translated = translated.replace(day, t(`calendar.${day}`));
    });

    // Переклад місяців
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach(month => {
        translated = translated.replace(month, t(`calendar.${month}`));
    });

    return translated;
  }
  
  const handleActiveStartDateChange = ({ activeStartDate: newDate }) => {
    const nextMonth = new Date(activeStartDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
  
    // Проверяем, входит ли новый месяц в текущий диапазон двух месяцев
    const isWithinDisplayedRange = 
      (newDate.getFullYear() === activeStartDate.getFullYear() && 
       newDate.getMonth() === activeStartDate.getMonth()) ||
      (newDate.getFullYear() === nextMonth.getFullYear() && 
       newDate.getMonth() === nextMonth.getMonth());
  
    if (isWithinDisplayedRange) {
      return; // Не обновляем, если новый месяц уже входит в отображаемый диапазон
    }
  
    setActiveStartDate(newDate);
  };

  const handlePrevMonth = () => {
    setIsNavigating(true);
    setActiveStartDate(new Date(activeStartDate.setMonth(activeStartDate.getMonth() - 1)));
  };
  
  const handleNextMonth = () => {
    setIsNavigating(true);
    setActiveStartDate(new Date(activeStartDate.setMonth(activeStartDate.getMonth() + 1)));
  };

  const handleClick = (e) => {
    const calendar = document.querySelector(".calendar-component");
    const guestCounter = document.querySelector(".guest-counter-component");

    if (calendar.classList.contains("show")) {
        calendar.classList.remove("show");
    } else {
        calendar.classList.add("show");
        guestCounter?.classList.remove("show"); // Закрываем СКГ
    }
  };

  const onChange = async (dates) => {
    const calendar = document.querySelector(".calendar-component");

    if (Array.isArray(dates)) {
        const [start, end] = dates;
        if (start && end) {
            // Убираем смещение из-за UTC
            const formattedStart = new Date(start);
            formattedStart.setHours(12, 0, 0, 0);

            const formattedEnd = new Date(end);
            formattedEnd.setHours(12, 0, 0, 0);

            const startDateStr = formattedStart.toLocaleDateString('sv'); // YYYY-MM-DD
            const endDateStr = formattedEnd.toLocaleDateString('sv'); // YYYY-MM-DD

            // setDates([startDateStr, endDateStr]);
            setDates({ checkIn: startDateStr, checkOut: endDateStr });

            calendar.classList.remove("show");
        }
    }
  };

  if (!ready) return null;

  return (
    <div className="dropdown-calendar" ref={calendarRef}>
        <button className="calendar-button" id='show-calendar' onClick={handleClick}>
          <img className="main-search-images" src="https://www.svgrepo.com/show/533389/calendar-days.svg" />
          {console.log("Dates: " + dates.checkIn + " and " + dates.checkOut)}
          {dates.checkIn ? `${translateDate(new Date(dates.checkIn)
              .toString()
              .substring(0,3))}, ${dates.checkIn.split('-')[2]} ${translateDate(new Date(dates.checkIn)
              .toString()
              .substring(4,7))}` : `${t('calendar.checkInDate')}`}

          {" - "}

          {dates.checkOut ? `${translateDate(new Date(dates.checkOut)
              .toString()
              .substring(0,3))}, ${dates.checkOut.split('-')[2]} ${translateDate(new Date(dates.checkOut)
              .toString()
              .substring(4,7))}` : `${t('calendar.checkOutDate')}`}
        </button>
        <div className='calendar-component'>
          <Calendar
          className="calendar"
          onChange={onChange}
          value={[dates.checkIn ? new Date(dates.checkIn) : null, dates.checkOut ? new Date(dates.checkOut) : null].filter(Boolean)}
          showDoubleView//показывает два месяца
          selectRange={true}//показывает диапазон дат
          minDate={new Date()} // Ограничение назад(раньше сегодня дату выбрать нельзя)
          maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0)} // Ограничение вперёд (опционально)
          prev2Label={null} // Убирает кнопку перемотки года назад
          next2Label={null} // Убирает кнопку перемотки года вперёд
          tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)} // Делаем даты серыми
          showNeighboringMonth={false} // Убирает дни соседних месяцев
          activeStartDate={activeStartDate}
          locale={i18n.language === 'ua' ? 'uk' : i18n.language}//Выставляет язык календаря на выбранный в хэдере
          onActiveStartDateChange={handleActiveStartDateChange}
          prevLabel={<button onClick={handlePrevMonth}>{"<"}</button>}
          nextLabel={<button onClick={handleNextMonth}>{">"}</button>}
          />
          <Calendar
          className="calendar-phones"
          onChange={onChange}
          value={[dates.checkIn ? new Date(dates.checkIn) : null, dates.checkOut ? new Date(dates.checkOut) : null].filter(Boolean)}
          selectRange={true}//показывает диапазон дат
          minDate={new Date()} // Ограничение назад(раньше сегодня дату выбрать нельзя)
          maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 3, 0)} // Ограничение вперёд (опционально)
          prev2Label={null} // Убирает кнопку перемотки года назад
          next2Label={null} // Убирает кнопку перемотки года вперёд
          tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)} // Делаем даты серыми
          showNeighboringMonth={false} // Убирает дни соседних месяцев
          activeStartDate={activeStartDate}
          locale={i18n.language === 'ua' ? 'uk' : i18n.language}//Выставляет язык календаря на выбранный в хэдере
          onActiveStartDateChange={handleActiveStartDateChange}
          prevLabel={<button onClick={handlePrevMonth}>{"<"}</button>}
          nextLabel={<button onClick={handleNextMonth}>{">"}</button>}
          />
      </div>
    </div>
  );
}

export default CalendarComponent