import React, {useEffect, useState} from 'react'
import { deleteApartment, listApartments } from '../services/ApartmentService'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import ScrollToTopButtonComponent from './ScrollToTopButtonComponent'

const ListApartmentsComponentAdmin = () => {
    const [Apartments, setApartments] = useState([]);
    const navigator = useNavigate();
    const transformBooleanToText = (value) => {
        return value ? "Есть" : "Нет";
    };
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);

    useEffect(() => {
        getAllApartments();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1023);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        getAllApartments();
    }, [])

    function getAllApartments() {
        listApartments().then((response) => {
            setApartments(response.data);
        }).catch(error => {
            console.error(error)
        })
    }

    function addNewApartment() {
        navigator('/admin/add-apartment')
    }

    function updateApartment(id) {
        navigator(`/admin/edit-apartment/${id}`);
    }

    function removeApartment(id) {
        deleteApartment(id).then((response) => {
            getAllApartments()
        }).catch(error => {
            console.error(error);
        })
    }

    const renderDesktopTable = () => (
        <div className='my-page' style={{ marginTop: "250px" }}>
            <div className='admin-table-apartment'>
                <h2 className='text-center'>Список квартир</h2>
                <button type='button' className='btn btn-primary mb-2' onClick={addNewApartment}>Добавить квартиру</button>
                <table className='my-table table table-striped table-bordered text-center'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Название квартиры</th>
                            <th>Краткое описание квартиры</th>
                            <th>Описание квартиры</th>
                            <th>Адрес квартиры</th>
                            <th>Цена квартиры</th>
                            <th>Этаж</th>
                            <th>Площадь квартиры</th>
                            <th>Количество спальных мест</th>
                            <th>Есть ли место для парковки</th>
                            <th>Есть ли Wi-Fi</th>
                            <th>Есть ли вид на море</th>
                            <th>Редактирование</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Apartments.map(apartment =>
                                <tr key={apartment.id}>
                                    <td><div className="scrollable-td">{apartment.id}</div></td>
                                    <td><div className="scrollable-td">{apartment.name}</div></td>
                                    <td><div className="scrollable-td">{apartment.shortDescription}</div></td>
                                    <td><div className="scrollable-td">{apartment.description}</div></td>
                                    <td><div className="scrollable-td">{apartment.address}</div></td>
                                    <td><div className="scrollable-td">{apartment.price} грн</div></td>
                                    <td><div className="scrollable-td">{apartment.floorNumber} этаж</div></td>
                                    <td><div className="scrollable-td">{apartment.areaOfApartment} м²</div></td>
                                    <td><div className="scrollable-td">{apartment.countOfSleepPlaces}</div></td>
                                    <td><div className="scrollable-td">{transformBooleanToText(apartment.hasParkingLot)}</div></td>
                                    <td><div className="scrollable-td">{transformBooleanToText(apartment.hasWiFi)}</div></td>
                                    <td><div className="scrollable-td">{transformBooleanToText(apartment.hasSeaView)}</div></td>
                                    <td>
                                        <div className='container-buttons'>
                                            <button className='btn btn-info' onClick={() => updateApartment(apartment.id)}>Обновить</button>
                                            <button 
                                                className='btn btn-danger' onClick={() => removeApartment(apartment.id)}
                                                style={{marginLeft: '10px'}}
                                            >Удалить</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <ScrollToTopButtonComponent />
        </div>
    );

    const renderMobileList = () => (
        <div className="admin-mobile-apartment-list">
            <h3>Объекты размещения</h3>
            <button className='admin-add-button' onClick={addNewApartment}>+</button>
            {Apartments.map(apartment => (
                <div key={apartment.id} className="admin-apartment-item" onClick={() => openApartmentDetails(apartment.id)}>
                    <img src="https://via.placeholder.com/50" alt="preview" className="admin-apartment-img"/>
                    <div>
                        <div className="admin-apartment-name">{apartment.name}</div>
                        <div className="admin-apartment-address">{apartment.address}</div>
                    </div>
                </div>
            ))}
            <ScrollToTopButtonComponent />
        </div>
    );

    return isMobile ? renderMobileList() : renderDesktopTable();
}

export default ListApartmentsComponentAdmin;