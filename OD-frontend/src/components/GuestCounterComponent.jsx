import React, { useState, useEffect, useRef } from 'react';
import '../../node_modules/react-calendar/src/Calendar.css';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

function GuestCounterComponent({ guestCount, setGuestCount, maxGuests }) { // <-- Получаем из MainComponent
    const guestRef = useRef(null);
    const { t, ready } = useTranslation();

    const handleClickOutside = (event) => {
        if (guestRef.current && !guestRef.current.contains(event.target)) {
            document.querySelector(".guest-counter-component")?.classList.remove("show");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClick = (e) => {
        const guestCounter = document.querySelector(".guest-counter-component");
        const calendar = document.querySelector(".calendar-component");
    
        if (guestCounter.classList.contains("show")) {
            guestCounter.classList.remove("show");
        } else {
            guestCounter.classList.add("show");
            calendar?.classList.remove("show"); // Закрываем календарь
        }
    };

    const increase = () => {
        if (guestCount < maxGuests) {
          setGuestCount(guestCount + 1);
          Cookies.set('guestCount', guestCount + 1, { expires: 1 / 96 });
        }
    };
    
    const decrease = () => {
        if (guestCount > 1) {
          setGuestCount(guestCount - 1);
          Cookies.set('guestCount', guestCount - 1, { expires: 1 / 96 });
        }
    };

    const onChange = (newGuestCount) => {
        const counter = document.querySelector(".guest-counter-component");
        if (newGuestCount >= 1) {
            setGuestCount(newGuestCount);
            counter.classList.remove("show");
        }
    };

    if (!ready) return null;

    return (
        <div className="dropdown-guests-count" ref={guestRef}>
            <button className="counter-button" id='show-calendar' onClick={handleClick}>
                <img className='main-search-images' src="https://www.svgrepo.com/show/440005/person.svg" />
                {guestCount} {t('guestCounter.guests')}
                <img className="dropdown-chevron" src="https://www.svgrepo.com/show/513816/chevron-down.svg" />
            </button>
            <div className='guest-counter-component'>
                <div className='counter-line'>
                    <p className='counter-line-text'>
                        {t('guestCounter.amountOfGuests')}
                    </p>
                    <div className='dec-inc-counter'>
                        {console.log("maxGuests: " + maxGuests)}
                        <button className="counter-btn" onClick={decrease} disabled={guestCount === 1}>-</button>
                        <span>{guestCount}</span>
                        <button className="counter-btn" onClick={increase} disabled={guestCount >= maxGuests}>+</button>
                    </div>
                </div>
                <button className="confirm-btn" onClick={() => {
                    Cookies.set('guestCount', guestCount, { expires: 1 / 96 }); // 15 минут
                    onChange(guestCount);
                }}>{t('guestCounter.ready')}</button>
            </div>
        </div>
    );
}

export default GuestCounterComponent