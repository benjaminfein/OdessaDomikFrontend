import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { getApartment } from '../services/ApartmentService'
import MapComponent from './MapComponent';
import { getApartmentPhotos } from '../services/S3Service';
import '../App.css'

const AboutApartmentComponent = () => {
    const { id } = useParams();
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [images, setImages] = useState([]);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const minSwipeDistance = 50;
    const isVideo = (url) => {
        return url.match(/\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv)$/i);
    };
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

    const isParkingLotThereOrNot = (value) => {
        return value ? (
            <div className="designation-card">
                <img src="https://www.svgrepo.com/show/487658/parking.svg" alt="Парковка" />
                <p>Парковочное место</p>
            </div>
        ) : <div className="empty-div"></div>;
    };

    const isWiFiThereOrNot = (value) => {
        return value ? (
            <div className="designation-card">
                <img src="https://www.svgrepo.com/show/532893/wifi.svg" alt="Парковка" />
                <p>Бесплатный WiFi</p>
            </div>
        ) : <div className="empty-div"></div>;
    };

    const isSeaViewThereOrNot = (value) => {
        return value ? (
            <div className="designation-card">
                <img src="https://www.svgrepo.com/show/246158/sea.svg" alt="Парковка" />
                <p>Вид на море</p>
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

    if (loading) {
        return <h4>Загрузка...</h4>;
    }

  return (
    <div className='my-page'>
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

                    <div className="short-description-and-map">
                        <div className='about-apartment-short-description'>{apartment.shortDescription}</div>
                        <MapComponent />
                    </div>
                </div>
            </div>
            <div className="cards-designations">
                {isParkingLotThereOrNot(apartment.hasParkingLot)}
                {isWiFiThereOrNot(apartment.hasWiFi)}
                
                <div className="designation-card">
                    <img src="https://www.svgrepo.com/show/473067/building.svg" alt="Этаж" />
                    <p>Номер этажа: {apartment.floorNumber}</p>
                </div>

                <div className="designation-card">
                    <img src="https://www.svgrepo.com/show/501713/ruler.svg" alt="Площадь" />
                    <p>Площадь квартиры: {apartment.areaOfApartment} м²</p>
                </div>

                {isSeaViewThereOrNot(apartment.hasSeaView)}

                <div className="designation-card">
                    <img src="https://www.svgrepo.com/show/490555/bed-double.svg" alt="Спальные места" />
                    <p>Количество спальных мест: {apartment.countOfSleepPlaces}</p>
                </div>
            </div>
            <div className="about-description">
                <div className="about-description-container">
                    {apartment.description}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AboutApartmentComponent