import React, { useEffect, useState, useRef  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvailableApartments } from '../services/ApartmentService';
import CalendarComponent from './CalendarComponent';
import GuestCounterComponent from './GuestCounterComponent';
import Cookies from 'js-cookie';
import '../App.css';
import ScrollToTopButtonComponent from './ScrollToTopButtonComponent';

const SearchingResultsComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [apartments, setApartments] = useState([]);
    const [originalApartments, setOriginalApartments] = useState([]);
    const [sortOption, setSortOption] = useState('old');
    const [maxGuests, setMaxGuests] = useState(10);
    const [dates, setDates] = useState({
        checkIn: Cookies.get('checkIn') ?? '',
        checkOut: Cookies.get('checkOut') ?? '',
    });
    const { checkIn, checkOut, guestCount: initialGuestCount } = location.state || {};
    const [guestCount, setGuestCount] = useState(
        Number(Cookies.get('guestCount')) || 2
    );
    const [previousDates, setPreviousDates] = useState(() => ({
        checkIn: Cookies.get('previousCheckIn') || '',
        checkOut: Cookies.get('previousCheckOut') || '',
    }));

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (dates.checkIn && dates.checkOut) {
            Cookies.set('checkIn', dates.checkIn, { expires: 1 / 96 });
            Cookies.set('checkOut', dates.checkOut, { expires: 1 / 96 });
            Cookies.set('guestCount', guestCount, { expires: 1 / 96 });
        }
    }, [dates]);

    useEffect(() => {
        if (guestCount) {
            Cookies.set('guestCount', guestCount, { expires: 1 / 96 });
        }
    }, [guestCount]);

    // Этот useEffect обновляет даты и количество гостей
    useEffect(() => {
        if (checkIn && checkOut) {
            setDates({ checkIn, checkOut });
            setPreviousDates({ checkIn: dates.checkIn, checkOut: dates.checkOut });
            Cookies.set('previousCheckIn', dates.checkIn, { expires: 1 / 96 });
            Cookies.set('previousCheckOut', dates.checkOut, { expires: 1 / 96 });
        }
        if (initialGuestCount) {
            setGuestCount(initialGuestCount);
        }
    }, [checkIn, checkOut, initialGuestCount]);

    // Этот useEffect отвечает за сортировку
    useEffect(() => {
        if (sortOption !== 'old') {
            sortApartments(sortOption);
        } else {
            setApartments([...originalApartments]); // Сброс к оригинальному порядку
        }
    }, [sortOption]);

    const fetchApartments = async () => {
        console.log("Запрос к серверу с параметрами:", dates.checkIn, dates.checkOut, guestCount);
        try {
            const response = await getAvailableApartments(dates.checkIn || "", dates.checkOut || "", guestCount);
            console.log("Ответ от сервера:", response.data);
            setApartments(response.data);
            setOriginalApartments(response.data); // Сохраняем оригинальный массив для сортировки
        } catch (error) {
            console.error("Ошибка при загрузке квартир:", error);
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

    useEffect(() => {
        // Проверяем, если это первый рендер, выполняем запрос
        if (isFirstRender.current) {
            console.log("Первый рендер: запрос к серверу с параметрами:", dates.checkIn, dates.checkOut, guestCount);
            fetchApartments();
            isFirstRender.current = false; // Устанавливаем флаг первого рендера в false
        }
    }, []); // Пустой массив зависимостей гарантирует выполнение ТОЛЬКО один раз

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
    
        // Выполняем запрос к серверу, чтобы обновить список квартир на основе переданных параметров
        await fetchApartments();

        // После выполнения поиска, сохраняем выбранные даты как "предыдущие"
        setPreviousDates({ checkIn: dates.checkIn, checkOut: dates.checkOut });
        Cookies.set('previousCheckIn', dates.checkIn, { expires: 1 / 96 });
        Cookies.set('previousCheckOut', dates.checkOut, { expires: 1 / 96 });
    };

    const sortApartments = (option) => {
        let sortedApartments;

        switch (option) {
            case 'asc':
                sortedApartments = [...originalApartments].sort((a, b) => a.price - b.price);
                break;
            case 'desc':
                sortedApartments = [...originalApartments].sort((a, b) => b.price - a.price);
                break;
            case 'new':
                sortedApartments = [...originalApartments].reverse(); // Переворачиваем массив
                break;
            case 'old':
                sortedApartments = [...originalApartments]; // Возвращаем исходный порядок
                break;
            default:
                sortedApartments = [...originalApartments];
                break;
        }

        setApartments(sortedApartments);
    };

    const calculateTotalPrice = (pricePerNight) => {
        const checkInDate = previousDates.checkIn || dates.checkIn;
        const checkOutDate = previousDates.checkOut || dates.checkOut;
        
        if (checkInDate && checkOutDate) {
            const calcCheckInDate = new Date(checkInDate);
            const calcCheckOutDate = new Date(checkOutDate);
            const diffInMs = calcCheckOutDate - calcCheckInDate;
            const nights = Math.max(1, Math.round(diffInMs / (1000 * 60 * 60 * 24)));
            return pricePerNight * nights;
        }
    };

    return (
        <div className="my-page">
            <div className="container">
                {/* Заголовок по центру */}
                <h2 className="list-of-apartments-text text-center">Варианты квартир с выбранными характеристиками:</h2>

                {/* Форма поиска */}
                <div className="wrapper-parallax" style={{width: "97%"}}>
                    <CalendarComponent dates={dates} setDates={setDates} />
                    <GuestCounterComponent guestCount={guestCount} setGuestCount={setGuestCount} maxGuests={maxGuests} />
                    <button className='search-button' onClick={handleSearch}>Поиск</button>
                </div>

                {/* Контейнер с кнопкой сортировки слева */}
                {console.log("checkIn and checkOut before sorted button: " + checkIn + " and " + checkOut)}
                {checkIn && checkOut && apartments.length > 0 && (
                    <div className="sort-button">
                        {/* Сортировка слева */}
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Сортировать
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button className="dropdown-item" onClick={() => setSortOption('asc')}>
                                        По возрастанию цены
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => setSortOption('desc')}>
                                        По убыванию цены
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => setSortOption('new')}>
                                        Сначала новые
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={() => setSortOption('old')}>
                                        Сначала старые
                                    </button>
                                </li>
                            </ul>
                        </div>
                        {/* Пустой div для выравнивания */}
                        <div></div>
                    </div>
                )}

                {/* Список квартир */}
                <div className="apartments-grid">
                    {apartments.map((apartment) => (
                        <div key={apartment.id} className="apartment-card">
                            <div className="card d-flex flex-column h-100">
                                <img
                                    src="https://www.trimarkproperties.com/gainesville/sabal-palms/luxury-apartments/og.jpg"
                                    className="apartment-img"
                                    alt={apartment.name}
                                />
                                <div className="apartment-body">
                                    <h5 className="apartment-title">{apartment.name}</h5>
                                    <p className="apartment-text">{apartment.shortDescription}</p>                    
                                    {(dates.checkIn && dates.checkOut) ? 
                                        <div className="mt-auto">
                                            <h4 className="apartment-price">
                                            {calculateTotalPrice(apartment.price)} грн
                                            </h4>
                                            <a
                                            onClick={(e) => {
                                                e.preventDefault();

                                                const totalPrice = calculateTotalPrice(apartment.price);

                                                Cookies.set('totalPrice', totalPrice, { expires: 1 });
                                                navigate(`/apartments/${apartment.id}/reservation`, {
                                                    state: {
                                                        checkIn: dates.checkIn,
                                                        checkOut: dates.checkOut,
                                                        guestCount,
                                                        totalPrice: calculateTotalPrice(apartment.price)
                                                    }
                                                });                                                
                                            }}
                                            className="apartment-btn"
                                            >
                                            Наличие мест
                                            </a>
                                        </div>
                                        :
                                        <button
                                        className="btn btn-outline-primary"
                                        onClick={() => {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            setShowPrices(true);
                                        }}
                                        >
                                            Показать цены
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ScrollToTopButtonComponent />
        </div>
    );
};

export default SearchingResultsComponent;