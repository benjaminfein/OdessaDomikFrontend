import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8090/api/user';

export const registration = (username, email, name, phoneNumber, password) => {
    return axios.post(
        `${REST_API_BASE_URL}/register`,
        { username, email, name, phoneNumber, password },
        { withCredentials: true } // Включаем передачу куки
    );
};

export const login = (email, password) => {
    return axios.post(
        `${REST_API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true } // Включаем передачу куки
    );
};

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    return parts.pop().split(";").shift();
};

export const getUser = () => {
    const jwtToken = getCookie("Token");
    return axios.get(`${REST_API_BASE_URL}/profile`, { withCredentials: true, headers: {"Authorization" : `Bearer ${jwtToken}`} });
};

export const getUserById = (userId) => axios.get(REST_API_BASE_URL + '/' + userId);