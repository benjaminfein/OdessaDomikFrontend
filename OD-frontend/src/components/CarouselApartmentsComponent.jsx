import React, { useState, useEffect, useRef } from 'react';
import i18n from '../i18n';
import { getApartmentPhotos } from '../services/S3Service';
import '../App.css';

const CarouselApartmentsComponent = ({ apartments }) => {
    const wrapperRef = useRef(null);
    const [randomApartments, setRandomApartments] = useState([]);
    const touchStartXRef = useRef(0);

    useEffect(() => {
        const prepareApartments = async () => {
            const shuffled = [...apartments].sort(() => 0.5 - Math.random());
    
            const apartmentsWithPhotos = await Promise.all(
                shuffled.map(async (apartment) => {
                    const photos = await getApartmentPhotos(apartment.id);
                    return { ...apartment, photoUrls: photos };
                })
            );
    
            setRandomApartments(apartmentsWithPhotos);
        };
    
        if (apartments.length > 0) {
            prepareApartments();
        }
    }, [apartments]);

    const scrollByCard = (direction) => {
        const wrapper = wrapperRef.current;
        const card = wrapper.querySelector('.apartment-card');
        if (!card) return;
        const cardWidth = card.offsetWidth + 16; // 16 — примерный gap
        wrapper.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
    };
    
    const handleTouchStart = (e) => {
        touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        const delta = e.changedTouches[0].clientX - touchStartXRef.current;
        if (Math.abs(delta) > 50) {
            scrollByCard(delta < 0 ? 1 : -1);
        }
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + 1, randomApartments.length - visibleCount)
        );
    };

    return (
        <div className="carousel-container">
            <button className="carousel-btn left" onClick={() => scrollByCard(-1)}>
                &#10094;
            </button>

            <div
                className="carousel-wrapper"
                ref={wrapperRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="carousel-track">
                    {randomApartments.map((apartment) => (
                        <div key={apartment.id} className="apartment-card">
                            <img
                                src={apartment.photoUrls?.[0] || 'https://via.placeholder.com/400x300?text=Нет+фото'}
                                className="apartment-img"
                                alt={apartment.name}
                            />
                            <div className="apartment-body">
                                <h5 className="apartment-title">{apartment.name}</h5>
                                <h4 className="apartment-price">{apartment.price} грн</h4>
                            </div>
                            <a href={`/${i18n.language}/apartments/${apartment.id}/about`} className="apartment-btn">
                                Подробнее
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <button className="carousel-btn right" onClick={() => scrollByCard(1)}>
                &#10095;
            </button>
        </div>
    );
};

export default CarouselApartmentsComponent;