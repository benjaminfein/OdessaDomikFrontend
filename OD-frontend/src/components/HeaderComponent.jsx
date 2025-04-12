import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getUser } from '../services/UserService';
import "../App.css";

const HeaderComponent = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerClass, setHeaderClass] = useState("absolute-header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const location = useLocation();
  const burgerRef = useRef(null);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await getUser();
        if (response && response.data) {
          setRole(response.data.User.role);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя", error);
        setRole(null);
        setIsLoggedIn(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    setHeaderClass(location.pathname === "/" ? "fixed-header" : "absolute-header");
  }, [location.pathname]);

  // Закрываем дропдауны при клике вне них
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-header-wrapper")) {
        setIsClientDropdownOpen(false);
        setIsAdminDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        burgerRef.current &&
        mobileNavRef.current &&
        !burgerRef.current.contains(event.target) &&
        !mobileNavRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setRole(null);
    setIsLoggedIn(false);
    document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
    window.location.href = "/";
  };

  return (
    <header className={headerClass}>
      <div className="header-container">
        <a className="logo" href='/'>
          OdessaDomik<br/>
          <p className="under-logo-sign">Квартиры посуточно Аркадия, Одесса</p>
        </a>


        <div
          ref={burgerRef}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`burger-menu ${isMobileMenuOpen ? "open" : ""}`}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>


        <div className="navigation">
          <a style={{padding : "0 20px"}} href="/">Главная<span></span></a>
          <a style={{padding : "0 20px"}} href="/apartments">Список квартир<span></span></a>
          <a style={{padding : "0 20px"}} href="/about-us">О нас<span></span></a>

          {!isLoggedIn && (
            <>
              <a style={{padding : "0 20px"}} href="/register">Зарегистрироваться<span></span></a>
              <a style={{padding : "0 20px"}} href="/login">Войти<span></span></a>
            </>
          )}

          {isLoggedIn && role === "client" && (
            <a className="dropdown-header-wrapper">
              <button
                className="account-button-header"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsClientDropdownOpen(!isClientDropdownOpen);
                  setIsAdminDropdownOpen(false);
                }}
              >
                Аккаунт<i className="bi bi-caret-down-fill"></i><span></span>
              </button>
              <div className={`dropdown-header ${isClientDropdownOpen ? "open" : ""}`}>
                <a href="/profile">Мой аккаунт</a>
                <a onClick={handleLogout}>Выйти</a>
              </div>
            </a>
          )}

          {isLoggedIn && role === "admin" && (
            <>
              <a className="dropdown-header-wrapper">
                <button
                  className="account-button-header"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAdminDropdownOpen(!isAdminDropdownOpen);
                    setIsClientDropdownOpen(false);
                  }}
                >
                  Инструменты администратора<i className="bi bi-caret-down-fill"></i><span></span>
                </button>
                <div className={`dropdown-header ${isAdminDropdownOpen ? "open" : ""}`}>
                  <a href="/admin/apartments">Редактировать квартиры</a>
                  <a href="/admin/reservations">Редактировать брони</a>
                  <a href="/admin/email-templates">Редактировать шаблоны эл. писем</a>
                </div>
              </a>
              <a href="/profile">Мой аккаунт<span></span></a>
              <a className="btn btn-danger" onClick={handleLogout}>Выйти из аккаунта</a>
            </>
          )}
        </div>

        <nav
          ref={mobileNavRef} 
          className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
        >
          <a href="/">Главная</a>
          <a href="/apartments">Список квартир</a>
          <a href="/about-us">О нас</a>
          {!isLoggedIn ? <a href="/login">Войти</a> : <a style={{color: "white"}} onClick={handleLogout}>Выйти</a>}
        </nav>
      </div>
    </header>
  );
};

export default HeaderComponent;