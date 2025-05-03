import React, { useEffect, useState, useContext, useRef } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import MapComponent from './MapComponent';
import Cookies from 'js-cookie';
import CalendarComponent from './CalendarComponent';
import GuestCounterComponent from './GuestCounterComponent';
import { getApartment, getAvailableApartments } from '../services/ApartmentService';
import { createReservation } from '../services/ApartmentService';
import { placeReservationOnHold } from '../services/ApartmentService';
import { useTranslation, Trans } from 'react-i18next';
import i18n from '../i18n';
import { getApartmentPhotos } from '../services/S3Service';
import '../App.css'

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
    const [currentImage, setCurrentImage] = useState(0);
    const { t, ready } = useTranslation();
    const [images, setImages] = useState([]);
    const [guestCount, setGuestCount] = useState(Number(stateGuestCount));
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const minSwipeDistance = 50;
    const [previousGuestCount, setPreviousGuestCount] = useState(
        Number(Cookies.get('previousGuestCount')) || Number(stateGuestCount)
    );
    const isSearchClicked = useRef(false);
    const isVideo = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(extension);
    };
    const [dates, setDates] = useState({
        checkIn: stateCheckIn,
        checkOut: stateCheckOut,
    });
    const [previousDates, setPreviousDates] = useState({
        checkIn: Cookies.get('previousCheckIn') || '',
        checkOut: Cookies.get('previousCheckOut') || '',
    });
    const handlePrev = () => {
        setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1);
    };
    const handleNext = () => {
        setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1);
    };
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };
    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
    
        const distance = touchStartX - touchEndX;
        if (distance > minSwipeDistance) {
            // свайп влево
            if (currentImage < images.length - 1) {
                setCurrentImage(currentImage + 1);
            }
        } else if (distance < -minSwipeDistance) {
            // свайп вправо
            if (currentImage > 0) {
                setCurrentImage(currentImage - 1);
            }
        }
    
        // сброс
        setTouchStartX(null);
        setTouchEndX(null);
    };

    useEffect(() => {
        if (sessionStorage.getItem('reloadAfterLogin') === 'true') {
            sessionStorage.removeItem('reloadAfterLogin');
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        const track = document.querySelector('.carousel-track');
        let startX = 0;
        let isSwiping = false;
    
        const handleTouchStart = (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        };
    
        const handleTouchMove = (e) => {
            if (!isSwiping) return;
            const currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
    
            // Порог свайпа (чтобы не срабатывало на случайных касаниях)
            if (diffX > 30) {
                handleNext();
                isSwiping = false;
            } else if (diffX < -30) {
                handlePrev();
                isSwiping = false;
            }
        };
    
        const handleTouchEnd = () => {
            isSwiping = false;
        };
    
        if (track) {
            track.addEventListener('touchstart', handleTouchStart);
            track.addEventListener('touchmove', handleTouchMove);
            track.addEventListener('touchend', handleTouchEnd);
        }
    
        return () => {
            if (track) {
                track.removeEventListener('touchstart', handleTouchStart);
                track.removeEventListener('touchmove', handleTouchMove);
                track.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [currentImage]);  // Следим за обновлением currentImage    

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
        return value ? (
            <div className="designation-card">
                <img src="https://www.svgrepo.com/show/487658/parking.svg" alt={t('reservationComponent.parking')} />
                <p>{t('reservationComponent.parking')}</p>
            </div>
        ) : <div className="empty-div"></div>;
    };

    const isWiFiThereOrNot = (value) => {
        return value ? (
            <div className="designation-card">
                <img src="https://www.svgrepo.com/show/532893/wifi.svg" alt={t('reservationComponent.wifi')} />
                <p>{t('reservationComponent.wifi')}</p>
            </div>
        ) : <div className="empty-div"></div>;
    };

    const isSeaViewThereOrNot = (value) => {
        return value ? (
            <div className="designation-card">
                <img src="https://www.svgrepo.com/show/246158/sea.svg" alt={t('reservationComponent.seaView')} />
                <p>{t('reservationComponent.seaView')}</p>
            </div>
        ) : <div className="empty-div"></div>;
    };

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                setLoading(true);
                const response = await getApartment(id);
                setApartment(response.data);
    
                const photos = await getApartmentPhotos(id);
                setImages(photos);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchApartment();
    }, [id]);

    const handleReservation = () => {
        if (!user) {
            navigate(`/${i18n.language}/login`, { state: { from: location.pathname } });
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
                alert(t('reservationComponent.reservationSuccess'));
                setIsModalOpen(false);  // Закрываем модальное окно
            } catch (error) {
                console.error("Ошибка при отправке бронирования:", error);
                alert(t('reservationComponent.reservationError'));
            }
        } else {
            alert(t('reservationComponent.checkRulesAlert'));
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
            alert(t('reservationComponent.phoneCopied'));
        }).catch((err) => {
            console.error("Ошибка при копировании номера: ", err);
        });
    }

    if (!ready) return null;

    return (
        <div className='my-page'>
            {loading ? <h4>{t('reservationComponent.loading')}</h4> : (
                <>
                <h4 className='about-apartment-name'>{apartment.name}</h4>
                <p className='about-apartment-address'>{apartment.address}</p>
                <div className='my-container'>
                    <div className="about-first-section">
                        <div className="about-first-section-container">
                            <div
                                className="photo-carousel"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <div
                                    className="photo-carousel-track"
                                    style={{ transform: `translateX(-${currentImage * 100}%)` }}
                                >
                                    {images.length > 0 ? images.map((media, index) => (
                                        <div className="photo-carousel-slide" key={index}>
                                            {isVideo(media) ? (
                                                <video controls>
                                                    <source src={media} type="video/mp4" />
                                                    Ваш браузер не поддерживает видео.
                                                </video>
                                            ) : (
                                                <img src={media} alt={`Slide ${index}`} />
                                            )}
                                        </div>
                                    )) : (
                                        <div className="photo-carousel-slide">
                                            <img src="https://via.placeholder.com/800x500?text=Нет+фото" alt="Заглушка" />
                                        </div>
                                    )}
                                </div>

                                <button className="photo-carousel-control photo-prev" onClick={handlePrev}>&#10094;</button>
                                <button className="photo-carousel-control photo-next" onClick={handleNext}>&#10095;</button>

                                <div className="photo-carousel-indicators">
                                    {images.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`photo-indicator-bar ${index === currentImage ? 'active' : ''}`}
                                            onClick={() => setCurrentImage(index)}
                                        />
                                    ))}
                                </div>

                                <div className="photo-carousel-counter">
                                    {currentImage + 1}/{images.length}
                                </div>
                            </div>

                            <div className='short-description-and-map'>
                                    <div className='about-apartment-short-description'>{apartment.shortDescription}</div>
                                    <MapComponent />
                                    <div className="wrapper-parallax" style={{width: '100%'}}>
                                        <CalendarComponent dates={dates} setDates={setDates} />
                                        <GuestCounterComponent guestCount={guestCount} setGuestCount={setGuestCount} maxGuests={maxGuests} />
                                        <button className='search-button' onClick={handleSearch}>{t('main.search')}</button>
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="about-second-section">
                        <div className="cards-designations">
                            {isParkingLotThereOrNot(apartment.hasParkingLot)}
                            {isWiFiThereOrNot(apartment.hasWiFi)}

                            <div className="designation-card">
                                <img src="https://www.svgrepo.com/show/473067/building.svg" alt="Этаж" />
                                <p>{t('reservationComponent.floorNumber', { number: apartment.floorNumber })}</p>
                            </div>

                            <div className="designation-card">
                                <img src="https://www.svgrepo.com/show/501713/ruler.svg" alt="Площадь" />
                                <p>{t('reservationComponent.area', { area: apartment.areaOfApartment })} м²</p>
                            </div>

                            {isSeaViewThereOrNot(apartment.hasSeaView)}

                            <div className="designation-card">
                                <img src="https://www.svgrepo.com/show/490555/bed-double.svg" alt="Спальные места" />
                                <p>{t('reservationComponent.area', { area: apartment.areaOfApartment })} м²</p>
                            </div>
                        </div>
                        <div className="reservation-payment-content">
                            {isApartmentValid ? (
                                <div className="apartment-price" style={{fontSize: '38px'}}>
                                    {calculateTotalPrice(apartment.price)} грн
                                </div>
                            ) : (
                                <div className="apartment-price error-message-reservation">
                                    {t('reservationComponent.apartmentNotValid')}
                                </div>
                            )}

                            <button 
                                className="reservation-button"
                                onClick={handleReservation}
                                disabled={!isApartmentValid}
                            >
                                {t('reservationComponent.reserveButton')}
                            </button>
                            {/* Модальное окно */}
                            {isModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <div style={{ display: "flex" }}>
                                            <div className="email-template">
                                                <h4>{t('reservationComponent.livingConditions')}</h4>
                                                {/* Тут письмо */}
                                                <Trans
                                                    i18nKey="reservationComponent.modalText"
                                                    components={[<br />]}
                                                />
                                            </div>
                                            <div className="modal-call-manager">
                                                <Trans
                                                    i18nKey="reservationComponent.attentionText"
                                                    components={[<br />]}
                                                />
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
                                                    {t('reservationComponent.agreeWithRules')}
                                                </label>
                                            </div>
                                            <button 
                                                className="modal-submit-button"
                                                disabled={!isChecked} 
                                                onClick={handleSubmitReservation}
                                            >
                                                {t('reservationComponent.submitReservation')}
                                            </button>
                                        </div>
                                        <button className="close-modal" onClick={closeModal}>❌</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="about-description">
                        <div className="about-description-container">
                            {apartment.description}
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    )
}

export default ReservationComponent