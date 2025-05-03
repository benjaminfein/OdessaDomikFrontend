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
            navigate(`/${i18n.language}/apartments`);
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
            <div className="my-page">
                <div className="register-form">
                    <div className="form-wrapper">
                        <h2 className="form-title">Создайте аккаунт</h2>
                        <p className="form-subtitle">Зарегистрируйтесь, чтобы получить доступ ко всем нашим сервисам.</p>

                        {errorMessage && <div className="form-error">{errorMessage}</div>}

                        <form className="form-body" onSubmit={registerUser}>
                        <div className="form-group">
                            <label htmlFor="username">Имя пользователя</label>
                            <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Ваше имя</label>
                            <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Номер телефона</label>
                            <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Пароль</label>
                            <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                            />
                        </div>
                        <button type="submit" className="form-button" disabled={isLoading}>
                            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                        </button>
                        </form>

                        <p className="form-footer">Все права защищены.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterComponent;
