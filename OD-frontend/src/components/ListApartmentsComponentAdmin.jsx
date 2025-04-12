import React, {useEffect, useState} from 'react'
import { deleteApartment, listApartments } from '../services/ApartmentService'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import ScrollToTopButtonComponent from './ScrollToTopButtonComponent'

const ListApartmentsComponent = () => {

    const [Apartments, setApartments] = useState([]);

    const navigator = useNavigate();

    const transformBooleanToText = (value) => {
        return value ? "Есть" : "Нет";
    };

    useEffect(() => {
        getAllAparments();
    }, [])

    function getAllAparments() {
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
            getAllAparments()
        }).catch(error => {
            console.error(error);
        })
    }

  return (
    <div className='my-page' style={{ marginTop: "200px" }}>
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
                                <td>{apartment.id}</td>
                                <td>{apartment.name}</td>
                                <td>{apartment.shortDescription}</td>
                                <td>{apartment.description}</td>
                                <td>{apartment.address}</td>
                                <td>{apartment.price} грн</td>
                                <td>{apartment.floorNumber} этаж</td>
                                <td>{apartment.areaOfApartment} м²</td>
                                <td>{apartment.countOfSleepPlaces}</td>
                                <td>{transformBooleanToText(apartment.hasParkingLot)}</td>
                                <td>{transformBooleanToText(apartment.hasWiFi)}</td>
                                <td>{transformBooleanToText(apartment.hasSeaView)}</td>
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
  )
}

export default ListApartmentsComponent