import React, { useState } from 'react';
import { registration } from '../services/UserService';
import HeaderRegisterLoginComponent from './HeaderRegisterLoginComponent';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const RegisterComponent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const registerUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
    
        // Регулярные выражения для проверки формата
        const phoneRegex = /^\+[1-9]\d{1,14}$/; // Формат телефона "+<код страны><номер>"
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // Формат email "user@example.com"
    
        // Проверка формата номера телефона
        if (!phoneRegex.test(phoneNumber)) {
            setErrorMessage('Неверный формат номера телефона. Ожидается: +<код страны><номер>');
            setIsLoading(false);
            return;
        }
    
        // Проверка формата email
        if (!emailRegex.test(email)) {
            setErrorMessage('Неверный формат email. Ожидается: user@example.com');
            setIsLoading(false);
            return;
        }
    
        try {
            // Выполняем запрос на регистрацию
            await registration(username, email, name, phoneNumber, password);
    
            // После успешной регистрации перенаправляем пользователя на страницу логина
            navigate("/apartments");
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
    
                // Проверка на уже используемые username или email
                if (errorData.message.includes("username already exists")) {
                    setErrorMessage('Этот username уже занят. Попробуйте другой.');
                } else if (errorData.message.includes("email already exists")) {
                    setErrorMessage('Этот email уже зарегистрирован. Попробуйте другой.');
                } else {
                    setErrorMessage('Произошла ошибка при регистрации. Попробуйте снова.');
                }
            } else {
                console.error("Error:", error.message);
                setErrorMessage('Ошибка соединения. Попробуйте позже.');
            }
        } finally {
            setIsLoading(false);
        }
    };        

    return (
        <>
            <HeaderRegisterLoginComponent />
            <div className="my-page" style={{marginTop: "95px", justifyContent: "center"}}>
                <div className="register-form">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <h2 className="text-center fw-bold mb-4">Создайте аккаунт</h2>
                            <p className="text-center text-muted mb-4">
                                Зарегистрируйтесь, чтобы получить доступ ко всем нашим сервисам.
                            </p>
                            {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
                            <form className="p-4 border rounded shadow-sm" onSubmit={registerUser}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label fw-bold">Имя пользователя</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">Адрес электронной почты</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Ваше имя</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label fw-bold">Номер телефона</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-bold">Пароль</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={isLoading}>
                                    {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                                </button>
                            </form>
                            <p className="text-center mt-4 text-muted">
                                Все права защищены.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterComponent;
