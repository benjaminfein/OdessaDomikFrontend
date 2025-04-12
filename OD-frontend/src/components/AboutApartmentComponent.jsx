import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { getApartment } from '../services/ApartmentService'
import '../App.css'
import MapComponent from './MapComponent';


const AboutApartmentComponent = () => {

    const { id } = useParams(); // Получаем ID из URL
    const [apartment, setApartment] = useState(null); // Храним данные о квартире
    const [loading, setLoading] = useState(true); // Для отображения состояния загрузки

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

    if (loading) {
        return <h4>Загрузка...</h4>; // Отображаем, пока данные загружаются
    }

  return (
    <div className='my-page'>
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
                </div>
            </div>
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
            <div className="about-description">{apartment.description}</div>
        </div>
    </div>
  )
}

export default AboutApartmentComponent