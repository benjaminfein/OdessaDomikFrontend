import React, { useState } from 'react';
import { login, getUser } from '../services/UserService';
import HeaderRegisterLoginComponent from './HeaderRegisterLoginComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
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
                const returnTo = location.state?.from || "/apartments";
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
            window.location.reload();
        }
    };    

    return (
        <>
            <HeaderRegisterLoginComponent />
            <div className="my-page" style={{marginTop: "95px"}}>
                <div className="login-form">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <h2 className="text-center fw-bold mb-4">Войдите или создайте аккаунт</h2>
                            <p className="text-center text-muted mb-4">
                                Чтобы получить доступ к нашим сервисам, войдите, используя данные своего аккаунта на нашем сайте.
                            </p>
                            {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
                            <form className="p-4 border rounded shadow-sm" onSubmit={loginUser}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label fw-bold">Адрес электронной почты</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    {isLoading ? 'Загрузка...' : 'Продолжить'}
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

export default LoginComponent;