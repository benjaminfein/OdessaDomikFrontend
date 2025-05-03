import React, { useEffect, useState, useRef  } from 'react'
import { createApartment, getApartment, updateApartment } from '../services/ApartmentService'
import { useNavigate, useParams } from 'react-router-dom'
import { getApartmentPhotos, deleteApartmentPhotos, uploadApartmentPhotos } from '../services/S3Service';
import '../App.css'

const CreateOrUpdateApartmentComponent = () => {
  const shortRef = useRef(null);
  const descRef = useRef(null);
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
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedToUpload, setSelectedToUpload] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv)$/i);
  };

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    const total = selectedToUpload.length + newFiles.length;

    if (total > 15 - photos.length) {
      alert(`Вы превышаете лимит! Можно загрузить еще ${15 - photos.length} файлов.`);
      return;
    }

    setSelectedToUpload(prev => [...prev, ...newFiles]);
    
    // Сброс input, чтобы повторно выбрать те же файлы
    e.target.value = null;
  };
  
  const handleUploadConfirm = async () => {
    setIsUploading(true);
    try {
      await uploadApartmentPhotos(id, selectedToUpload);
      const updatedPhotos = await getApartmentPhotos(id);
      setPhotos(updatedPhotos);
      setSelectedToUpload([]);
      setShowUploadModal(false);
    } catch (err) {
      console.error("Ошибка при загрузке:", err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      const data = await getApartmentPhotos(id);
      setPhotos(data);
    };
    if (id) fetchPhotos();
  }, [id]);
  
  const togglePhotoSelection = (url) => {
    setSelectedPhotos((prev) =>
      prev.includes(url)
        ? prev.filter((u) => u !== url)
        : [...prev, url]
    );
  };
  
  const openDeleteModal = () => setIsModalOpen(true);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const filenames = selectedPhotos.map(url => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      });
      await deleteApartmentPhotos(id, filenames);
      setPhotos(prev => prev.filter(url => !selectedPhotos.includes(url)));
      setSelectedPhotos([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (shortRef.current) {
      shortRef.current.style.height = 'auto';
      shortRef.current.style.height = `${shortRef.current.scrollHeight}px`;
    }
    if (descRef.current) {
      descRef.current.style.height = 'auto';
      descRef.current.style.height = `${descRef.current.scrollHeight}px`;
    }
  }, []);

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

  return (
    <div className='my-page' style={{ margin: "200px 0" }}>
      <div className="admin-page">
        {/* 1я форма - просмотр/удаление фотографий */}
        <div className="photo-manager">
          <div className="photo-header">
            {!selectedPhotos.length ? (
              <span>{photos.length}/15</span>
            ) : (
              <span className="selected-counter">{selectedPhotos.length}</span>
            )}
          </div>

          <div className="photo-grid">
            {photos.map((url, index) => (
              <div
                key={index}
                className={`photo-item ${selectedPhotos.includes(url) ? 'selected' : ''}`}
                onClick={() => togglePhotoSelection(url)}
              >
                {isVideo(url) ? (
                  <video src={url} controls muted />
                ) : (
                  <img src={url} alt={`apartment-${index}`} />
                )}
                {selectedPhotos.includes(url) && (
                  <div className="photo-checkmark">✔</div>
                )}
              </div>
            ))}
          </div>

          {selectedPhotos.length > 0 && (
            <div className="photo-toolbar">
              <button onClick={openDeleteModal} className="delete-button">🗑</button>
            </div>
          )}

          {/* Модалка */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-window">
                <p>Вы уверены, что хотите удалить выбранные {selectedPhotos.length} фотографии?</p>
                
                {/* Спиннер при удалении */}
                {isDeleting && <div className="spinner"></div>}
                
                <div className="modal-actions">
                  <button onClick={handleDelete} disabled={isDeleting}>Да</button>
                  <button onClick={() => setIsModalOpen(false)} disabled={isDeleting}>Отмена</button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 2я форма - добавление/редактирование инофрмации для квартир */}
        <div className="admin-form-wrapper">
          <h2 className="form-title">{id ? 'Обновить квартиру' : 'Добавить квартиру'}</h2>
          <form className="admin-form">
            <div className="form-field">
              <label>Название:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Краткое описание:</label>
              <textarea
                ref={shortRef}
                value={shortDescription}
                onChange={(e) => {
                  setShortDescription(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="admin-textarea"
                style={{ overflow: 'hidden' }}
              />
            </div>

            <div className="form-field">
              <label>Описание:</label>
              <textarea
                ref={descRef}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="admin-textarea"
                style={{ overflow: 'hidden' }}
              />
            </div>

            <div className="form-field">
              <label>Адрес:</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Цена:</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Номер этажа:</label>
              <input type="number" value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Площадь квартиры:</label>
              <input type="number" value={areaOfApartment} onChange={(e) => setAreaOfApartment(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Количество спальных мест:</label>
              <input type="number" value={countOfSleepPlaces} onChange={(e) => setCountOfSleepPlaces(e.target.value)} />
            </div>

            <div className="form-toggle">
              <label>
                <input type="checkbox" checked={hasParkingLot} onChange={(e) => setHasParkingLot(e.target.checked)} />
                Есть ли парковочное место.
              </label>
              <label>
                <input type="checkbox" checked={hasWiFi} onChange={(e) => setHasWiFi(e.target.checked)} />
                Есть ли Wi-Fi.
              </label>
              <label>
                <input type="checkbox" checked={hasSeaView} onChange={(e) => setHasSeaView(e.target.checked)} />
                Есть ли вид на море.
              </label>
            </div>

            <button className="submit-button" onClick={saveOrUpdateApartment}>
              Подтвердить
            </button>
          </form>
        </div>

        {/* 3я форма - добавление фотографий */}
        <div className="upload-panel">
          <div className="upload-header">
            <span>Загрузить файлы</span>
            <input
              type="file"
              id="fileUploadInput"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleFileSelect(e)}
              style={{ display: 'none' }}
            />
            <button
              className="upload-button"
              onClick={() => document.getElementById('fileUploadInput').click()}
            >
              Выбрать файлы
            </button>
          </div>

          {selectedToUpload.length > 0 && (
            <div className="upload-preview">
              <p>{selectedToUpload.length} файлов выбрано</p>
              <button onClick={() => setShowUploadModal(true)} className="confirm-upload-button">
                Добавить файлы
              </button>
            </div>
          )}

          {/* Модалка загрузки */}
          {showUploadModal && (
            <div className="modal-overlay">
              <div className="modal-window">
                <p>Вы хотите добавить {selectedToUpload.length} новых файлов?</p>
                
                {isUploading && <div className="spinner"></div>}
                
                <div className="modal-actions">
                  <button onClick={handleUploadConfirm} disabled={isUploading}>Да</button>
                  <button onClick={() => setShowUploadModal(false)} disabled={isUploading}>Отмена</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateOrUpdateApartmentComponent