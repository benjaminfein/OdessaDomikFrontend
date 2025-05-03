import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8090/api/s3';

export const getApartmentPhotos = async (apartmentId) => {
    try {
        const response = await axios.get(`${REST_API_BASE_URL}/list/${apartmentId}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении фотографий:", error);
        return [];
    }
};

export const deleteApartmentPhotos = async (apartmentId, fileNames) => {
    try {
        const params = new URLSearchParams();
        fileNames.forEach(name => params.append("fileNames", name));

        const response = await axios.delete(`${REST_API_BASE_URL}/delete-multiple/${apartmentId}?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при удалении фотографий:", error);
        throw error;
    }
};

export const uploadApartmentPhotos = async (apartmentId, files) => {
    try {
        const formData = new FormData();
        formData.append("apartmentId", apartmentId);
        files.forEach(file => {
            formData.append("files", file); // имя параметра должно совпадать с @RequestParam("files")
        });

        const response = await axios.post(`${REST_API_BASE_URL}/upload-multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке фотографий:", error);
        throw error;
    }
};