// import React, { useEffect, useState, useContext, useRef } from 'react'
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../AuthContext';
// import '../App.css'
// import MapComponent from './MapComponent';
// import Cookies from 'js-cookie';
// import CalendarComponent from './CalendarComponent';
// import GuestCounterComponent from './GuestCounterComponent';
// import { getApartment, getAvailableApartments } from '../services/ApartmentService';

// const ReservationComponent = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [apartment, setApartment] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const { user } = useContext(AuthContext);
//     const [maxGuests, setMaxGuests] = useState(10);
//     const [apartments, setApartments] = useState([]);
//     const isFirstRender = useRef(true);
//     const [isApartmentValid, setIsApartmentValid] = useState(true);    
//     const stateCheckIn = location.state?.checkIn || Cookies.get('checkIn') || '';
//     const stateCheckOut = location.state?.checkOut || Cookies.get('checkOut') || '';
//     const stateGuestCount = location.state?.guestCount || Cookies.get('guestCount') || 2;
//     const stateTotalPrice = location.state?.totalPrice || Cookies.get('totalPrice') || '';
//     const [dates, setDates] = useState({
//         checkIn: stateCheckIn,
//         checkOut: stateCheckOut,
//     });
//     const [previousDates, setPreviousDates] = useState({
//         checkIn: Cookies.get('previousCheckIn') || '',
//         checkOut: Cookies.get('previousCheckOut') || '',
//     });
//     const [guestCount, setGuestCount] = useState(Number(stateGuestCount));
//     const [previousGuestCount, setPreviousGuestCount] = useState(
//         Number(Cookies.get('previousGuestCount')) || Number(stateGuestCount)
//     );
//     const isSearchClicked = useRef(false);

//     useEffect(() => {
//         if (!isSearchClicked.current) return;
    
//         const validateApartment = async () => {
//             try {
//                 const availableResponse = await getAvailableApartments(dates.checkIn, dates.checkOut, previousGuestCount);
//                 const availableApartments = availableResponse.data;
//                 const isAvailable = availableApartments.some(apartment => apartment.id === Number(id));
    
//                 const apartmentResponse = await getApartment(id);
//                 const apartmentData = apartmentResponse.data;
//                 const hasEnoughSpace = guestCount <= apartmentData.countOfSleepPlaces;
    
//                 setIsApartmentValid(isAvailable && hasEnoughSpace);
//             } catch (error) {
//                 console.error("Ошибка при проверке квартиры:", error);
//                 setIsApartmentValid(false);
//             }
//         };
    
//         validateApartment();
//     }, [id, previousDates.checkIn, previousDates.checkOut, guestCount]); 

//     const isParkingLotThereOrNot = (value) => {
//         return value ? <div className="col"><div className="card card-designations">
//         <div className="about-card-body card-body">
//             <div className="container-images-icons">
//                 <img src="https://www.svgrepo.com/show/487658/parking.svg" className="small-images-designations"></img>
//             </div>
//             <div className="parking-and-wifi-container-text-about">
//                 <h6 className="text-designation card-subtitle text-body-secondary">Парковочное место</h6>
//             </div>
//         </div>
//     </div></div> : <div className="empty-div"></div>;
//     };

//     const isWiFiThereOrNot = (value) => {
//         return value ? <div className="col"><div className="card card-designations">
//         <div className="about-card-body card-body">
//             <div className="container-images-icons">
//                 <img src="https://www.svgrepo.com/show/532893/wifi.svg" className="small-images-designations"></img>
//             </div>
//             <div className="parking-and-wifi-container-text-about">
//                 <h6 className="text-designation card-subtitle text-body-secondary">Бесплатный WiFi</h6>
//             </div>
//         </div>
//     </div></div> : <div className="empty-div"></div>;
//     };

//     const isSeaViewThereOrNot = (value) => {
//         return value ? <div className="col"><div className="card card-designations">
//         <div className="about-card-body card-body">
//             <div className="container-images-icons">
//                 <img src="https://www.svgrepo.com/show/246158/sea.svg" className="small-images-designations"></img>
//             </div>
//             <div className="container-text-about">
//                 <h6 className="text-designation card-subtitle text-body-secondary">Вид на море</h6>
//             </div>
//         </div>
//     </div></div> : <div className="empty-div"></div>;
//     };

//     useEffect(() => {
//         const fetchApartment = async () => {
//             try {
//                 setLoading(true); // Устанавливаем состояние загрузки
//                 const response = await getApartment(id); // Ожидаем выполнения запроса
//                 setApartment(response.data); // Сохраняем данные в state
//             } catch (error) {
//                 console.error("Ошибка при загрузке данных:", error);
//             } finally {
//                 setLoading(false); // Выключаем состояние загрузки
//             }
//         };

//         fetchApartment();
//     }, [id]);

//     const handleReservation = () => {
//         if (!user) {
//             // Если пользователь не авторизован, отправляем на страницу логина
//             navigate('/login');
//         } else {
//             // Если авторизован, показываем окно с деталями бронирования
//             alert(`Здравствуйте, ${user.name}! Вот данные для бронирования.`);
//         }
//     };

//     useEffect(() => {
//         const fetchMaxGuests = async () => {
//             try {
//                 console.log("Параметры запроса:", { checkIn: dates.checkIn, checkOut: dates.checkOut, guestCount });
    
//                 if (!guestCount || !dates.checkIn || !dates.checkOut) {
//                     console.log("Ждем загрузку данных...");
//                     return;
//                 }
    
//                 const apartments = await getAvailableApartments(dates.checkIn, dates.checkOut, guestCount);
//                 console.log("response for maxGuests:", apartments.data);
    
//                 const max = apartments.data.length > 0 
//                     ? Math.max(...apartments.data.map(a => a.countOfSleepPlaces || 0)) 
//                     : 10;
    
//                 setMaxGuests(max);
//             } catch (error) {
//                 console.error("Ошибка при получении квартир:", error);
//             }
//         };
    
//         fetchMaxGuests();
//     }, [dates, guestCount]);

//     const handleSearch = async () => {
//         isSearchClicked.current = true;
//         console.log("Отправляем запрос с параметрами:", { checkIn: dates.checkIn, checkOut: dates.checkOut, guestCount });
    
//         // Обновляем куки с новыми значениями
//         Cookies.set('checkIn', dates.checkIn || '', { expires: 1 / 96 });
//         Cookies.set('checkOut', dates.checkOut || '', { expires: 1 / 96 });
//         Cookies.set('guestCount', guestCount, { expires: 1 / 96 });
//         Cookies.set('previousGuestCount', guestCount, { expires: 1 / 96 });
    
//         // Обновляем previousDates и previousGuestCount
//         setPreviousDates({ checkIn: dates.checkIn, checkOut: dates.checkOut });
//         setPreviousGuestCount(guestCount);
    
//         Cookies.set('previousCheckIn', dates.checkIn || '', { expires: 1 / 96 });
//         Cookies.set('previousCheckOut', dates.checkOut || '', { expires: 1 / 96 });
    
//         // Запрашиваем новые квартиры
//         try {
//             const response = await getAvailableApartments(dates.checkIn || "", dates.checkOut || "", guestCount);
//             console.log("Ответ от сервера:", response.data);
//             setApartments(response.data);
//         } catch (error) {
//             console.error("Ошибка при загрузке квартир:", error);
//         }
//     };    
    
//     const calculateTotalPrice = (pricePerNight) => {
//         const checkInDate = previousDates.checkIn || dates.checkIn;
//         const checkOutDate = previousDates.checkOut || dates.checkOut;
//         console.log("checkInDate and checkOutDate: " + checkInDate + " and " + checkOutDate);
    
//         if (checkInDate && checkOutDate) {
//             const calcCheckInDate = new Date(checkInDate);
//             const calcCheckOutDate = new Date(checkOutDate);
//             const diffInMs = calcCheckOutDate - calcCheckInDate;
//             const nights = Math.max(1, Math.round(diffInMs / (1000 * 60 * 60 * 24)));
//             return pricePerNight * nights;
//         }
//         return 0;
//     };

//     return (
//     <div className='my-page'>
//         {loading ? <h4>Загрузка...</h4> : (
//             <>
//             <h4 className='about-apartment-name'>{apartment.name}</h4>
//             <p className='about-apartment-address'>{apartment.address}</p>
//             <div className='my-container'>
//                 <div className="about-first-section">
//                     <div id="carouselExampleIndicators" className="carousel slide">
//                     <div className="carousel-indicators">
//                         <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
//                         <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
//                         <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
//                     </div>
//                     <div className="carousel-inner">
//                         <div className="carousel-item active">
//                         <img src="https://live.staticflickr.com/65535/54186708396_2c1315a661_k.jpg" className="d-block w-100" alt="..." />
//                         </div>
//                         <div className="carousel-item">
//                         <img src="https://live.staticflickr.com/65535/54185825672_9ebdd26457_k.jpg" className="d-block w-100" alt="..." />
//                         </div>
//                         <div className="carousel-item">
//                         <img src="https://live.staticflickr.com/65535/54186708461_82f2c5f6f3_k.jpg" className="d-block w-100" alt="..." />
//                         </div>
//                     </div>
//                     <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
//                         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                         <span className="visually-hidden">Previous</span>
//                     </button>
//                     <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
//                         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                         <span className="visually-hidden">Next</span>
//                     </button>
//                     </div>
//                     <div className='short-description-and-map'>
//                             <div className='about-apartment-short-description'>{apartment.shortDescription}</div>
//                             <MapComponent />
//                             <div className="wrappaer-parallax" style={{marginLeft: '100px', width: '775px', gap: '10px'}}>
//                                 <CalendarComponent dates={dates} setDates={setDates} />
//                                 <GuestCounterComponent guestCount={guestCount} setGuestCount={setGuestCount} maxGuests={maxGuests} />
//                                 <button className='search-button' onClick={handleSearch}>Поиск</button>
//                             </div>
//                     </div>
//                 </div>
//                 <div className="about-second-section">
//                     <div className="cards-designations">
//                         {isParkingLotThereOrNot(apartment.hasParkingLot)}
//                         {isWiFiThereOrNot(apartment.hasWiFi)}
//                         <div className="col">
//                             <div className="card card-designations">
//                                 <div className="about-card-body card-body">
//                                     <div className="container-images-icons">
//                                         <img src="https://www.svgrepo.com/show/473067/building.svg" className="small-images-designations"></img>
//                                     </div>
//                                     <div className="container-text-about">
//                                         <h6 className="text-designation card-subtitle text-body-secondary">Номер этажа: {apartment.floorNumber}</h6>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col">
//                             <div className="card card-designations">
//                                 <div className="about-card-body card-body">
//                                     <div className="container-images-icons">
//                                         <img src="https://www.svgrepo.com/show/501713/ruler.svg" className="small-images-designations"></img>
//                                     </div>
//                                     <div className="container-text-about">
//                                         <h6 className="text-designation card-subtitle text-body-secondary">Площадь квартиры: {apartment.areaOfApartment} м²</h6>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {isSeaViewThereOrNot(apartment.hasSeaView)}
//                         <div className="col">
//                             <div className="card card-designations">
//                                 <div className="about-card-body card-body">
//                                     <div className="container-images-icons">
//                                         <img src="https://www.svgrepo.com/show/490555/bed-double.svg" className="small-images-designations"></img>
//                                     </div>
//                                     <div className="container-text-about">
//                                         <h6 className="text-designation card-subtitle text-body-secondary">Количество спальных мест: {apartment.countOfSleepPlaces}</h6>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="reservation-payment-content">
//                         {isApartmentValid ? (
//                             <div className="apartment-price">
//                                 {calculateTotalPrice(apartment.price)} грн
//                             </div>
//                         ) : (
//                             <div className="apartment-price error-message-reservation">
//                                 Данная квартира не соответствует выбранному запросу
//                             </div>
//                         )}

//                         <button 
//                             className="reservation-button"
//                             onClick={handleReservation}
//                             disabled={!isApartmentValid}
//                         >
//                             Оставить заявку
//                         </button>
//                     </div>
//                 </div>
//                 <div className="about-description">{apartment.description}</div>
//             </div>
//             </>
//         )}
//     </div>
//   )
// }

// export default ReservationComponent