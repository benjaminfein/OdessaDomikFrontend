import React, { useState } from 'react';
import { login, getUser } from '../services/UserService';
import HeaderRegisterLoginComponent from './HeaderRegisterLoginComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from '../i18n';
import '../App.css';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [res, setRes] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const loginUser = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            // Выполняем login запрос
            await login(email, password);
            
            // Выполняем запрос getUser для получения роли
            const userResponse = await getUser();
            const userRole = userResponse.data.User.role;
            
            // Навигация в зависимости от роли
            if (userRole === "admin") {
                navigate("/admin");
            } else {
                const returnTo = location.state?.from || `/${i18n.language}/apartments`;
                sessionStorage.setItem('reloadAfterLogin', 'true');
                navigate(returnTo);
            }
        } catch (error) {
            if (error.response) {
                console.error("Error during login or getUser:", error.response.data);
                setErrorMessage('Неправильный email или пароль. Попробуйте снова.');
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
                <div className="login-form">
                <div className="form-wrapper">
                    <h2 className="form-title">Войдите или создайте аккаунт</h2>
                    <p className="form-subtitle">
                    Чтобы получить доступ к нашим сервисам, войдите, используя данные своего аккаунта на нашем сайте.
                    </p>

                    {errorMessage && <div className="form-error">{errorMessage}</div>}

                    <form className="form-body" onSubmit={loginUser}>
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
                        {isLoading ? 'Загрузка...' : 'Продолжить'}
                    </button>
                    </form>

                    <p className="form-footer">Все права защищены.</p>
                </div>
                </div>
            </div>
        </>
    );
};

export default LoginComponent;