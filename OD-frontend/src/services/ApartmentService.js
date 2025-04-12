import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8090/api/apartments';

//Apartments endpoints
export const listApartments = () => axios.get(REST_API_BASE_URL);

export const createApartment = (apartment) => axios.post(REST_API_BASE_URL, apartment);

export const getApartment = (apartmentId) => axios.get(REST_API_BASE_URL + '/' + apartmentId);

export const updateApartment = (apartmentId, apartment) => axios.put(REST_API_BASE_URL + '/' + apartmentId, apartment)

export const deleteApartment = (apartmentId) => axios.delete(REST_API_BASE_URL + '/' + apartmentId);

export const getApartmentDetailsByApartmentId = (apartmentId) => axios.get(REST_API_BASE_URL + 'apartment-details/' + apartmentId);

export const getAvailableApartments = (checkInDate, checkOutDate, guestCount = 2) => {
  return axios.get(`${REST_API_BASE_URL}/available`, {
      params: {
          checkIn: checkInDate || "",
          checkOut: checkOutDate || "",
          guestCount
      }
  });
};

//Reservations endpoints
export const createReservation = (reservationDTO) => axios.post(`${REST_API_BASE_URL}/create-reservation`, reservationDTO);

export const listReservations = () => axios.get(REST_API_BASE_URL + "/get-reservations");

export const deleteReservation = (reservationId) => axios.delete(REST_API_BASE_URL + '/delete-reservation/' + reservationId);

export const deleteAllPendingReservations = () => axios.delete(REST_API_BASE_URL + "/delete-pending");

export const placeReservationOnHold = (reservationId) => axios.put(REST_API_BASE_URL + '/reservation-on-hold/' + reservationId);

export const cancelReservation = (reservationId) => axios.put(REST_API_BASE_URL + '/cancel-reservation/' + reservationId);

export const confirmReservation = (reservationId) => axios.put(REST_API_BASE_URL + '/confirm-reservation/' + reservationId);