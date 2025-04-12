import React, { useEffect, useState } from 'react';
import { listApartments } from '../services/ApartmentService';
import '../App.css';
import ScrollToTopButtonComponent from './ScrollToTopButtonComponent';

const ListApartmentsComponent = () => {
    const [apartments, setApartments] = useState([]);
    const [originalApartments, setOriginalApartments] = useState([]); // Оригинальный массив данных
    const [sortOption, setSortOption] = useState('old'); // Начальное состояние сортировки

    useEffect(() => {
        getAllApartments();
    }, []);

    useEffect(() => {
        if (sortOption !== 'old') {
            sortApartments(sortOption);
        } else {
            setApartments([...originalApartments]); // Сброс к оригинальному порядку
        }
    }, [sortOption]);    

    function getAllApartments() {
        listApartments()
            .then((response) => {
                setApartments(response.data); // Данные с БД
                setOriginalApartments(response.data); // Сохраняем оригинальный массив
            })
            .catch((error) => {
                console.error('Error fetching apartments:', error);
            });
    }    

    function sortApartments(option) {
        let sortedApartments;
    
        switch (option) {
            case 'asc':
                sortedApartments = [...originalApartments].sort((a, b) => a.price - b.price);
                break;
            case 'desc':
                sortedApartments = [...originalApartments].sort((a, b) => b.price - a.price);
                break;
            case 'new':
                sortedApartments = [...originalApartments].reverse(); // Переворачиваем массив для "сначала новые"
                break;
            case 'old':
                sortedApartments = [...originalApartments]; // Возвращаем изначальный порядок
                break;
            default:
                sortedApartments = [...originalApartments];
                break;
        }
    
        setApartments(sortedApartments);
    }         

    return (
        <div className="my-page">
            <div className="container">
                {/* Заголовок по центру */}
                <h2 className="list-of-apartments-text text-center mb-4">Список всех наших квартир</h2>

                {/* Контейнер с кнопкой сортировки слева */}
                <div className="sort-button d-flex justify-content-between align-items-center">
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
                                <button
                                    className="dropdown-item"
                                    onClick={() => setSortOption('asc')}
                                >
                                    По возрастанию цены
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setSortOption('desc')}
                                >
                                    По убыванию цены
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setSortOption('new')}
                                >
                                    Сначала новые
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => setSortOption('old')}
                                >
                                    Сначала старые
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Пустой div для выравнивания */}
                    <div></div>
                </div>

                {/* Список квартир */}
                <div className="apartments-grid">
                    {apartments.map((apartment) => (
                        <div key={apartment.id} className="apartment-card">
                            <img
                                src="https://www.trimarkproperties.com/gainesville/sabal-palms/luxury-apartments/og.jpg"
                                className="apartment-img"
                                alt={apartment.name}
                            />
                            <div className="apartment-body">
                                <h5 className="apartment-title">{apartment.name}</h5>
                                <p className="apartment-text">{apartment.shortDescription}</p>
                                <h4 className="apartment-price">{apartment.price} грн</h4>
                            </div>
                            <a href={`http://localhost:3000/apartments/${apartment.id}/about`} className="apartment-btn">
                                    Подробнее
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            <ScrollToTopButtonComponent />
        </div>
    );
};

export default ListApartmentsComponent;
