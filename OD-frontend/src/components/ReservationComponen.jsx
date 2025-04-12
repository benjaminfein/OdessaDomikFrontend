import React, { useEffect, useState, useContext, useRef } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../App.css'
import MapComponent from './MapComponent';
import Cookies from 'js-cookie';
import CalendarComponent from './CalendarComponent';
import GuestCounterComponent from './GuestCounterComponent';
import { getApartment, getAvailableApartments } from '../services/ApartmentService';
import { createReservation } from '../services/ApartmentService';
import { placeReservationOnHold } from '../services/ApartmentService';

const ReservationComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [maxGuests, setMaxGuests] = useState(10);
    const [apartments, setApartments] = useState([]);
    const isFirstRender = useRef(true);
    const [isApartmentValid, setIsApartmentValid] = useState(true);    
    const stateCheckIn = location.state?.checkIn || Cookies.get('checkIn') || '';
    const stateCheckOut = location.state?.checkOut || Cookies.get('checkOut') || '';
    const stateGuestCount = location.state?.guestCount || Cookies.get('guestCount') || 2;
    const stateTotalPrice = location.state?.totalPrice || Cookies.get('totalPrice') || '';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [dates, setDates] = useState({
        checkIn: stateCheckIn,
        checkOut: stateCheckOut,
    });
    const [previousDates, setPreviousDates] = useState({
        checkIn: Cookies.get('previousCheckIn') || '',
        checkOut: Cookies.get('previousCheckOut') || '',
    });
    const [guestCount, setGuestCount] = useState(Number(stateGuestCount));
    const [previousGuestCount, setPreviousGuestCount] = useState(
        Number(Cookies.get('previousGuestCount')) || Number(stateGuestCount)
    );
    const isSearchClicked = useRef(false);

    useEffect(() => {
        if (!isSearchClicked.current) return;
    
        const validateApartment = async () => {
            try {
                const availableResponse = await getAvailableApartments(dates.checkIn, dates.checkOut, previousGuestCount);
                const availableApartments = availableResponse.data;
                const isAvailable = availableApartments.some(apartment => apartment.id === Number(id));
    
                const apartmentResponse = await getApartment(id);
                const apartmentData = apartmentResponse.data;
                const hasEnoughSpace = guestCount <= apartmentData.countOfSleepPlaces;
    
                setIsApartmentValid(isAvailable && hasEnoughSpace);
            } catch (error) {
                console.error("Ошибка при проверке квартиры:", error);
                setIsApartmentValid(false);
            }
        };
    
        validateApartment();
    }, [id, previousDates.checkIn, previousDates.checkOut, guestCount]); 

    const isParkingLotThereOrNot = (value) => {
        return value ? <div className="col"><div className="card card-designations">
        <div className="about-card-body card-body">
            <div className="container-images-icons">
                <img src="https://www.svgrepo.com/show/487658/parking.svg" className="small-images-designations"></img>
            </div>
            <div className="parking-and-wifi-container-text-about">
                <h6 className="text-designation card-subtitle text-body-secondary">Парковочное место</h6>
            </div>
        </div>
    </div></div> : <div className="empty-div"></div>;
    };

    const isWiFiThereOrNot = (value) => {
        return value ? <div className="col"><div className="card card-designations">
        <div className="about-card-body card-body">
            <div className="container-images-icons">
                <img src="https://www.svgrepo.com/show/532893/wifi.svg" className="small-images-designations"></img>
            </div>
            <div className="parking-and-wifi-container-text-about">
                <h6 className="text-designation card-subtitle text-body-secondary">Бесплатный WiFi</h6>
            </div>
        </div>
    </div></div> : <div className="empty-div"></div>;
    };

    const isSeaViewThereOrNot = (value) => {
        return value ? <div className="col"><div className="card card-designations">
        <div className="about-card-body card-body">
            <div className="container-images-icons">
                <img src="https://www.svgrepo.com/show/246158/sea.svg" className="small-images-designations"></img>
            </div>
            <div className="container-text-about">
                <h6 className="text-designation card-subtitle text-body-secondary">Вид на море</h6>
            </div>
        </div>
    </div></div> : <div className="empty-div"></div>;
    };

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                setLoading(true); // Устанавливаем состояние загрузки
                const response = await getApartment(id); // Ожидаем выполнения запроса
                setApartment(response.data); // Сохраняем данные в state
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setLoading(false); // Выключаем состояние загрузки
            }
        };

        fetchApartment();
    }, [id]);

    const handleReservation = () => {
        if (!user) {
            navigate('/login');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleAgree = () => {
        setIsChecked(!isChecked);
    };

    const handleSubmitReservation = async () => {
        if (isChecked) {
            try {
                const reservationDTO = {
                    apartmentId: apartment?.id ? Number(apartment.id) : null,
                    checkInDate: stateCheckIn ?? null,
                    checkOutDate: stateCheckOut ?? null,
                    guestCount: stateGuestCount ?? null,
                    status: "PENDING",
                    userId: user?.User?.id ?? null,
                    clientEmail: user?.Email ?? null
                };                
                console.log(reservationDTO);
                console.log(user);
                console.log("userId: " + user.User.id + "\nuser.email: " + user.Email);
    
                const responseCreateReservation = await createReservation(reservationDTO);
                const reservationId = responseCreateReservation.data.id;
                console.log(responseCreateReservation.data);
    
                // Теперь отправляем запрос на удержание резервации
                const responsePlaceReservationOnHold = await placeReservationOnHold(reservationId);
                console.log(responsePlaceReservationOnHold);
    
                // Логика успешной отправки
                alert("Заявка на бронирование отправлена. Пожалуйста, не забудьте набрать нашего менеджера!");
                setIsModalOpen(false);  // Закрываем модальное окно
            } catch (error) {
                console.error("Ошибка при отправке бронирования:", error);
                alert("Произошла ошибка. Попробуйте снова.");
            }
        } else {
            alert("Пожалуйста, согласитесь с правилами перед отправкой бронирования.");
        }
    };    

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchMaxGuests = async () => {
            try {
                console.log("Параметры запроса:", { checkIn: dates.checkIn, checkOut: dates.checkOut, guestCount });
    
                if (!guestCount || !dates.checkIn || !dates.checkOut) {
                    console.log("Ждем загрузку данных...");
                    return;
                }
    
                const apartments = await getAvailableApartments(dates.checkIn, dates.checkOut, guestCount);
                console.log("response for maxGuests:", apartments.data);
    
                const max = apartments.data.length > 0 
                    ? Math.max(...apartments.data.map(a => a.countOfSleepPlaces || 0)) 
                    : 10;
    
                setMaxGuests(max);
            } catch (error) {
                console.error("Ошибка при получении квартир:", error);
            }
        };
    
        fetchMaxGuests();
    }, [dates, guestCount]);

    const handleSearch = async () => {
        isSearchClicked.current = true;
        console.log("Отправляем запрос с параметрами:", { checkIn: dates.checkIn, checkOut: dates.checkOut, guestCount });
    
        // Обновляем куки с новыми значениями
        Cookies.set('checkIn', dates.checkIn || '', { expires: 1 / 96 });
        Cookies.set('checkOut', dates.checkOut || '', { expires: 1 / 96 });
        Cookies.set('guestCount', guestCount, { expires: 1 / 96 });
        Cookies.set('previousGuestCount', guestCount, { expires: 1 / 96 });
    
        // Обновляем previousDates и previousGuestCount
        setPreviousDates({ checkIn: dates.checkIn, checkOut: dates.checkOut });
        setPreviousGuestCount(guestCount);
    
        Cookies.set('previousCheckIn', dates.checkIn || '', { expires: 1 / 96 });
        Cookies.set('previousCheckOut', dates.checkOut || '', { expires: 1 / 96 });
    
        // Запрашиваем новые квартиры
        try {
            const response = await getAvailableApartments(dates.checkIn || "", dates.checkOut || "", guestCount);
            console.log("Ответ от сервера:", response.data);
            setApartments(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке квартир:", error);
        }
    };    
    
    const calculateTotalPrice = (pricePerNight) => {
        const checkInDate = previousDates.checkIn || dates.checkIn;
        const checkOutDate = previousDates.checkOut || dates.checkOut;
        console.log("checkInDate and checkOutDate: " + checkInDate + " and " + checkOutDate);
    
        if (checkInDate && checkOutDate) {
            const calcCheckInDate = new Date(checkInDate);
            const calcCheckOutDate = new Date(checkOutDate);
            const diffInMs = calcCheckOutDate - calcCheckInDate;
            const nights = Math.max(1, Math.round(diffInMs / (1000 * 60 * 60 * 24)));
            return pricePerNight * nights;
        }
        return 0;
    };

    function copyPhoneNumber() {
        const phoneNumber = document.querySelector('.phone-number').textContent;
        navigator.clipboard.writeText(phoneNumber).then(() => {
            alert("Номер скопирован!");
        }).catch((err) => {
            console.error("Ошибка при копировании номера: ", err);
        });
    }

    return (
    <div className='my-page'>
        {loading ? <h4>Загрузка...</h4> : (
            <>
            <h4 className='about-apartment-name'>{apartment.name}</h4>
            <p className='about-apartment-address'>{apartment.address}</p>
            <div className='my-container'>
                <div className="about-first-section">
                    <div id="carouselExampleIndicators" className="carousel slide">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                        <img src="https://live.staticflickr.com/65535/54186708396_2c1315a661_k.jpg" className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                        <img src="https://live.staticflickr.com/65535/54185825672_9ebdd26457_k.jpg" className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                        <img src="https://live.staticflickr.com/65535/54186708461_82f2c5f6f3_k.jpg" className="d-block w-100" alt="..." />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    </div>
                    <div className='short-description-and-map'>
                            <div className='about-apartment-short-description'>{apartment.shortDescription}</div>
                            <MapComponent />
                            <div className="wrapper-parallax" style={{marginLeft: '100px', width: '775px', gap: '10px'}}>
                                <CalendarComponent dates={dates} setDates={setDates} />
                                <GuestCounterComponent guestCount={guestCount} setGuestCount={setGuestCount} maxGuests={maxGuests} />
                                <button className='search-button' onClick={handleSearch}>Поиск</button>
                            </div>
                    </div>
                </div>
                <div className="about-second-section">
                    <div className="cards-designations">
                        {isParkingLotThereOrNot(apartment.hasParkingLot)}
                        {isWiFiThereOrNot(apartment.hasWiFi)}
                        <div className="col">
                            <div className="card card-designations">
                                <div className="about-card-body card-body">
                                    <div className="container-images-icons">
                                        <img src="https://www.svgrepo.com/show/473067/building.svg" className="small-images-designations"></img>
                                    </div>
                                    <div className="container-text-about">
                                        <h6 className="text-designation card-subtitle text-body-secondary">Номер этажа: {apartment.floorNumber}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card card-designations">
                                <div className="about-card-body card-body">
                                    <div className="container-images-icons">
                                        <img src="https://www.svgrepo.com/show/501713/ruler.svg" className="small-images-designations"></img>
                                    </div>
                                    <div className="container-text-about">
                                        <h6 className="text-designation card-subtitle text-body-secondary">Площадь квартиры: {apartment.areaOfApartment} м²</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isSeaViewThereOrNot(apartment.hasSeaView)}
                        <div className="col">
                            <div className="card card-designations">
                                <div className="about-card-body card-body">
                                    <div className="container-images-icons">
                                        <img src="https://www.svgrepo.com/show/490555/bed-double.svg" className="small-images-designations"></img>
                                    </div>
                                    <div className="container-text-about">
                                        <h6 className="text-designation card-subtitle text-body-secondary">Количество спальных мест: {apartment.countOfSleepPlaces}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="reservation-payment-content">
                        {isApartmentValid ? (
                            <div className="apartment-price">
                                {calculateTotalPrice(apartment.price)} грн
                            </div>
                        ) : (
                            <div className="apartment-price error-message-reservation">
                                Данная квартира не соответствует выбранному запросу
                            </div>
                        )}

                        <button 
                            className="reservation-button"
                            onClick={handleReservation}
                            disabled={!isApartmentValid}
                        >
                            Я бронирую
                        </button>
                        {/* Модальное окно */}
                        {isModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <div style={{ display: "flex" }}>
                                        <div className="email-template">
                                            <h4>Условия проживания</h4>
                                            {/* Тут будет письмо */}
                                            <p className="modal-text">Здравствуйте! <br />
                                            Спасибо за ваш запрос на бронирование наших апартаментов! Мы рады, что вы выбрали именно нас, и будем рады обеспечить вам комфортное проживание.<br />
                                            Адрес апартаментов:<br />
                                            Гагаринское плато 5/2, новый жилой комплекс “Гагарин Плаза”.<br />
                                            Важная информация<br />
                                            Курение и проведение мероприятий в наших апартаментах категорически запрещены.<br />
                                            При заселении необходимо предъявить оригинал паспорта и внести залоговый депозит в размере 2000 грн в качестве гарантии сохранности имущества.<br />
                                            Возврат депозита осуществляется при выезде после проверки квартиры.<br />
                                            Обратите внимание: В некоторых случаях сумма залогового депозита может быть увеличена, например:<br />
                                            <ul><li>при заселении с животными;</li>
                                                <li>размещении гостей младше 21 года без сопровождения родителей.</li>
                                            </ul>
                                            После беседы с менеджером принимается окончательное решение о возможности заселения и размере залогового депозита.<br />
                                            Время заезда и выезда
                                            <ul><li>🕒 Заезд: с 14:30</li>
                                                <li>🕚 Выезд: до 11:00</li>
                                            </ul>
                                            Подтверждение бронирования<br />
                                            Для гарантированного бронирования необходимо внести предоплату в размере стоимости первых суток проживания.<br />
                                            По приезду оплачивается оставшаяся сумма за проживание + залоговый депозит.<br />
                                            Как внести предоплату?<br />
                                            Пожалуйста, свяжитесь с нами для получения реквизитов и дополнительной информации.<br />
                                            Если в течение 1 часа после запроса вы не выходите на связь, а также не вносите предоплату в оговоренный с менеджером срок, бронирование может быть отменено.<br />
                                            После отправки предоплаты обязательно сообщите нам! Мы проверим поступление средств и подтвердим ваше бронирование.<br />
                                            Сохраняйте квитанцию до поселения !<br />
                                            Благодарим за понимание! Ждем вас и будем рады вашему приезду!<br /><br />
                                            </p>
                                        </div>
                                        <div className="modal-call-manager">
                                            ВНИМАНИЕ!<br /><br />
                                            Без звонка по этому номеру ваша бронь будет анулированна в течении часа!<br />
                                            Пожалуйста, совершите звонок ПОСЛЕ нажатия кнопки "Оставить заявку на бронирование"<br /><br />
                                            Номер телефона для подтверждения вашей брони менеджером:<br /><br />
                                            <div className="phone-number-container">
                                                <a className="phone-number" href="tel:+380634487370" style={{ textDecoration: "none" }}>+380634487370</a>
                                                <button className="copy-button" onClick={copyPhoneNumber}>
                                                    <i className="fa-solid fa-copy"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                        <div className="checkbox-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <label className="modal-do-u-agree-label">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isChecked} 
                                                    onChange={handleAgree}
                                                />
                                                Вы согласны с нашими правилами проживания и условиями пользования
                                            </label>
                                        </div>
                                        <button 
                                            className="modal-submit-button"
                                            disabled={!isChecked} 
                                            onClick={handleSubmitReservation}
                                        >
                                            Оставить заявку на бронирование
                                        </button>
                                    </div>
                                    <button className="close-modal" onClick={closeModal}>❌</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="about-description">{apartment.description}</div>
            </div>
            </>
        )}
    </div>
  )
}

export default ReservationComponent