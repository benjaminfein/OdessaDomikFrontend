import React, { useEffect, useState } from 'react'
import { createApartment, getApartment, updateApartment } from '../services/ApartmentService'
import { useNavigate, useParams } from 'react-router-dom'
import '../App.css'

const CreateOrUpdateApartmentComponent = () => {

    const [name, setName] = useState('')
    const [shortDescription, setShortDescription] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [price, setPrice] = useState('')
    const [hasParkingLot, setHasParkingLot] = useState('')
    const [hasWiFi, setHasWiFi] = useState('')
    const [floorNumber, setFloorNumber] = useState('')
    const [areaOfApartment, setAreaOfApartment] = useState('')
    const [hasSeaView, setHasSeaView] = useState('')
    const [countOfSleepPlaces, setCountOfSleepPlaces] = useState('')
    

    const {id} = useParams();
    const [errors, setErrors] = useState({
        name: '',
        shortDescription: '',
        description: '',
        address: '',
        price: '',
        floorNumber: '',
        areaOfApartment: '',
        countOfSleepPlaces: ''
    })
    
    const navigator = useNavigate();

    useEffect(() => {
        if(id) {
          getApartment(id).then((response) => {
              setName(response.data.name);
              setShortDescription(response.data.shortDescription);
              setDescription(response.data.description);
              setAddress(response.data.address);
              setPrice(response.data.price);
              setHasParkingLot(response.data.hasParkingLot);
              setHasWiFi(response.data.hasWiFi);
              setFloorNumber(response.data.floorNumber);
              setAreaOfApartment(response.data.areaOfApartment);
              setHasSeaView(response.data.hasSeaView);
              setCountOfSleepPlaces(response.data.countOfSleepPlaces);
          }).catch(error => {
            console.error(error);
          })
        }
    }, [id]);

    function saveOrUpdateApartment(e) {
      e.preventDefault();

      if(validateForm()) {

        const apartment = {name, shortDescription, description, address, price, hasParkingLot, hasWiFi, floorNumber, areaOfApartment, hasSeaView, countOfSleepPlaces}

        if(id) {
            updateApartment(id, apartment).then((response) => {
                navigator('/admin/apartments');
            }).catch(error => {
                console.error(error);
            })
        } else {
            createApartment(apartment).then((response) => {
                navigator('/admin/apartments');
            }).catch(error => {
                console.error(error);
            })
        }
      }
    }

    function validateForm() {
      let valid = true;
    
      const maxShortDescriptionLength = 250;
      const minDescriptionLength = 400;
      const maxDescriptionLength = 2000;
      const errorsCopy = { ...errors };
    
      const isEmpty = (value) => value === null || value === undefined || value.trim() === '';
    
      if (!isEmpty(name)) {
        errorsCopy.name = '';
      } else {
        errorsCopy.name = 'Обязательно необходимо ввести имя! Без него квартира не добавится.';
        valid = false;
      }
    
      if (!isEmpty(shortDescription)) {
        if (shortDescription.trim().length > maxShortDescriptionLength) {
          errorsCopy.shortDescription = `Описание не должно превышать ${maxShortDescriptionLength} символов. Сейчас: ${shortDescription.trim().length} символов.`;
          valid = false;
        } else {
          errorsCopy.shortDescription = '';
        }
      } else {
        errorsCopy.shortDescription = 'Обязательно необходимо ввести краткое описание! Без него квартира не добавится.';
        valid = false;
      }
    
      if (!isEmpty(description)) {
        const descriptionLength = description.trim().length;
        if (descriptionLength < minDescriptionLength || descriptionLength > maxDescriptionLength) {
          errorsCopy.description = `Описание не должно быть менее 400 символов и более 2000 символов. Сейчас: ${descriptionLength}.`;
          valid = false;
        } else {
          errorsCopy.description = '';
        }
      } else {
        errorsCopy.description = 'Обязательно необходимо ввести описание!';
        valid = false;
      }
    
      if (!isEmpty(address)) {
        errorsCopy.address = '';
      } else {
        errorsCopy.address = 'Обязательно необходимо ввести адрес! Без него квартира не добавится.';
        valid = false;
      }
    
      if (!isNaN(Number(price)) && String(price).trim() !== '') {
        errorsCopy.price = '';
      } else {
        errorsCopy.price = 'Обязательно необходимо ввести цену! Без нее квартира не добавится.';
        valid = false;
      }
    
      if (!isNaN(Number(floorNumber)) && String(floorNumber).trim() !== '') {
        errorsCopy.floorNumber = '';
      } else {
        errorsCopy.floorNumber = 'Обязательно необходимо ввести номер этажа! Без этого квартира не добавится.';
        valid = false;
      }
    
      if (!isNaN(Number(areaOfApartment)) && String(areaOfApartment).trim() !== '') {
        errorsCopy.areaOfApartment = '';
      } else {
        errorsCopy.areaOfApartment = 'Обязательно необходимо ввести площадь квартиры! Без этого квартира не добавится.';
        valid = false;
      }
    
      if (!isNaN(Number(countOfSleepPlaces)) && String(countOfSleepPlaces).trim() !== '') {
        errorsCopy.countOfSleepPlaces = '';
      } else {
        errorsCopy.countOfSleepPlaces = 'Обязательно необходимо ввести количество спальных мест! Без этого квартира не добавится.';
        valid = false;
      }
    
      setErrors(errorsCopy);
    
      return valid;
    }    

    function pageTitle() {
        if(id) {
          return <h2 className='text-center'>Обновить квартиру</h2>
        } else {
          return <h2 className='text-center'>Добавить квартиру</h2>
        }
    }

  return (
    <div className='my-page'>
      <div className='container'>
          <br /> <br />
          <div className='row'>
              <div className='card col-md-6 offset-md-3 offset-md-3'>
                  {
                      pageTitle()
                  }
                  <div className='card-body'>
                      <form>
                          <div className='form-group mb-2'>
                              <label className='form-label'>Название:</label>
                              <input 
                                    className={`form-control ${ errors.name ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите название квартиры" 
                                    name="name" 
                                    value={name || ''}
                                    onChange={(e) => setName(e.target.value)} />
                              { errors.name && <div className='invalid-feedback'> { errors.name} </div> }
                          </div>

                          <div className='form-group mb-2'>
                              <label className='form-label'>Краткое описание:</label>
                              <input 
                                    className={`form-control ${ errors.shortDescription ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите краткое описание квартиры" 
                                    name="shortDescription" 
                                    value={shortDescription || ''}
                                    onChange={(e) => setShortDescription(e.target.value)} />
                              { errors.shortDescription && <div className='invalid-feedback'> { errors.shortDescription} </div> }
                          </div>

                          <div className='form-group mb-2'>
                              <label className='form-label'>Описание:</label>
                              <input 
                                    className={`form-control ${ errors.description ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите описание квартиры" 
                                    name="description" 
                                    value={description || ''}
                                    onChange={(e) => setDescription(e.target.value)} />
                              { errors.description && <div className='invalid-feedback'> { errors.description} </div> }
                          </div>

                          <div className='form-group mb-2'>
                              <label className='form-label'>Адрес:</label>
                              <input 
                                    className={`form-control ${ errors.address ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите адрес квартиры" 
                                    name="address" 
                                    value={address || ''}
                                    onChange={(e) => setAddress(e.target.value)} />
                              { errors.address && <div className='invalid-feedback'> { errors.address} </div> }
                          </div>

                          <div className='form-group mb-2'>
                              <label className='form-label'>Цена:</label>
                              <input 
                                    className={`form-control ${ errors.price ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите цену квартиры" 
                                    name="price" 
                                    value={price || ''}
                                    onChange={(e) => setPrice(e.target.value)} />
                              { errors.price && <div className='invalid-feedback'> { errors.price} </div> }
                          </div>

                          <div className='form-group mb-2'>
                              <label className='form-label'>Номер этажа:</label>
                              <input 
                                    className={`form-control ${ errors.floorNumber ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите номер этажа квартиры" 
                                    name="floorNumber" 
                                    value={floorNumber || ''}
                                    onChange={(e) => setFloorNumber(e.target.value)} />
                              { errors.floorNumber && <div className='invalid-feedback'> { errors.floorNumber} </div> }
                          </div>

                          <div className='form-group mb-2'>
                              <label className='form-label'>Площадь квартиры:</label>
                              <input 
                                    className={`form-control ${ errors.areaOfApartment ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите площадь квартиры" 
                                    name="areaOfApartment" 
                                    value={areaOfApartment || ''}
                                    onChange={(e) => setAreaOfApartment(e.target.value)} />
                              { errors.areaOfApartment && <div className='invalid-feedback'> { errors.areaOfApartment} </div> }
                          </div>

                          <div className='form-group mb-2'>
                              <label className='form-label'>Количество спальных мест:</label>
                              <input 
                                    className={`form-control ${ errors.countOfSleepPlaces ? 'is-invalid': '' }`}
                                    type="text" 
                                    placeholder="Введите количество спальных мест" 
                                    name="countOfSleepPlaces" 
                                    value={countOfSleepPlaces || ''}
                                    onChange={(e) => setCountOfSleepPlaces(e.target.value)} />
                              { errors.countOfSleepPlaces && <div className='invalid-feedback'> { errors.countOfSleepPlaces} </div> }
                          </div>

                          <div className='form-group mb-2'>
                            <div className="form-check form-switch">
                              <input 
                                    className="form-check-input"
                                    type="checkbox" 
                                    id="flexSwitchCheckDefault"
                                    placeholder="Выберите, есть ли парковочное место." 
                                    name="hasParkingLot" 
                                    checked={hasParkingLot || false}
                                    onChange={(e) => setHasParkingLot(e.target.checked)} />
                              <label className="form-check-label" for="flexSwitchCheckDefault">Есть ли паровочное место.</label>
                            </div>
                          </div>

                          <div className='form-group mb-2'>
                            <div className="form-check form-switch">
                              <input 
                                    className="form-check-input"
                                    type="checkbox" 
                                    id="flexSwitchCheckDefault"
                                    placeholder="Выберите, есть ли Wi-Fi" 
                                    name="hasWiFi" 
                                    checked={hasWiFi || false}
                                    onChange={(e) => setHasWiFi(e.target.checked)} />
                              <label className="form-check-label" for="flexSwitchCheckDefault">Есть ли Wi-Fi.</label>
                            </div>
                          </div>

                          <div className='form-group mb-2'>
                            <div className="form-check form-switch">
                              <input 
                                    className="form-check-input"
                                    type="checkbox" 
                                    id="flexSwitchCheckDefault"
                                    placeholder="Выберите, есть ли вид на море" 
                                    name="hasSeaView" 
                                    checked={hasSeaView || false}
                                    onChange={(e) => setHasSeaView(e.target.checked)} />
                              <label className="form-check-label" for="flexSwitchCheckDefault">Есть ли вид на море.</label>
                            </div>
                          </div>

                          <button className='btn btn-success' onClick={saveOrUpdateApartment}>Подтвердить</button>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default CreateOrUpdateApartmentComponent