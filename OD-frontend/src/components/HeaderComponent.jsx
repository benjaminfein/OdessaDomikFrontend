import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../services/UserService';
import { useTranslation, Trans } from 'react-i18next';
import i18n from '../i18n';
import "../App.css";

const HeaderComponent = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerClass, setHeaderClass] = useState("absolute-header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const { t, ready } = useTranslation();
  const location = useLocation();
  const burgerRef = useRef(null);
  const mobileNavRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const amountOfYears = currentYear - 2008;
  const navigate = useNavigate();
  const isCompactLanguage = window.innerWidth < 400;

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
    const normalizedPath = location.pathname.replace(/\/$/, "");
    const langMatch = normalizedPath.split('/')[1];
  
    if (normalizedPath === `/${langMatch}`) {
      // Главная страница → main-header
      setHeaderClass("main-header");
    } else if (normalizedPath.includes("/admin")) {
      // Админские страницы → admin-header
      setHeaderClass("admin-header");
    } else {
      // Всё остальное → client-header
      setHeaderClass("client-header");
    }
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

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;

    // Берем текущий путь без языка
    const parts = location.pathname.split('/');
    parts[1] = selectedLang; // заменяем язык

    const newPath = parts.join('/') || `/${selectedLang}`;
    navigate(newPath);
    window.location.reload(); // жёсткий перезапуск страницы (нужно для полной локализации)
  };

  if (!ready) return null;

  return (
    <div className="header-and-logo-sign">
      <header className={headerClass}>
        <div className="header-container">
          <div className="logo" >
            <a href='/'>OdessaDomik</a>
            {role !== 'admin' && (
              <div className="language-selector">
                <select onChange={handleLanguageChange} value={i18n.language}>
                  <option value="ua">{isCompactLanguage ? "Укр" : "Україньска"}</option>
                  <option value="ru">{isCompactLanguage ? "Рус" : "Русский"}</option>
                  <option value="en">{isCompactLanguage ? "Eng" : "English"}</option>
                </select>
              </div>
            )}
          </div>


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
            {role !== 'admin' && [
              <a style={{padding : "0 20px"}} href="/">
                {t('header.main')}<span />
              </a>,
              <a style={{padding : "0 20px"}} href={`/${i18n.language}/about-us`}>
                {t('header.about')}<span />
              </a>
            ]}

            {!isLoggedIn && (
              <>
                <a style={{padding : "0 20px"}} href={`/${i18n.language}/register`}>
                  {t('header.signUp')}<span />
                </a>
                <a style={{padding : "0 20px"}} href={`/${i18n.language}/login`}>
                  {t('header.signIn')}<span />
                </a>
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
                  {t('header.account')}<i className="bi bi-caret-down-fill" /><span />
                </button>
                <div className={`dropdown-header ${isClientDropdownOpen ? "open" : ""}`}>
                  <a href={`/${i18n.language}/profile`}>
                    {t('header.myAccount')}
                  </a>
                  <a onClick={handleLogout}>
                    {t('header.signOut')}
                  </a>
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
                    Инструменты администратора<i className="bi bi-caret-down-fill" /><span />
                  </button>
                  <div className={`dropdown-header ${isAdminDropdownOpen ? "open" : ""}`}>
                    <a href="/admin/apartments">
                      Редактировать квартиры
                    </a>
                    <a href="/admin/reservations">
                      Редактировать брони
                    </a>
                    <a href="/admin/email-templates">
                      Редактировать шаблоны эл. писем
                    </a>
                  </div>
                </a>
                <a href="/ru/profile">
                  Мой аккаунт<span />
                </a>
                <a className="btn btn-danger" onClick={handleLogout}>
                  Выйти
                </a>
              </>
            )}
          </div>

          {(headerClass !== "admin-header" && headerClass !== "client-header") && (
            <p className="under-logo-sign">
              <Trans
                i18nKey="header.underLogoSign"
                values={{ years: amountOfYears }}
                components={[<br />]}
              />
            </p>
          )}

          <nav
            ref={mobileNavRef}
            className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
          >
            <a href={`/${i18n.language}/`}>{t('header.main')}</a>
            <a href={`/${i18n.language}/about-us`}>{t('header.about')}</a>

            {!isLoggedIn && (
              <>
                <a href={`/${i18n.language}/register`}>{t('header.signUp')}</a>
                <a href={`/${i18n.language}/login`}>{t('header.signIn')}</a>
              </>
            )}

            {isLoggedIn && role === 'client' && (
              <>
                <a href={`/${i18n.language}/profile`}>{t('header.myAccount')}</a>
                <a onClick={handleLogout}>{t('header.signOut')}</a>
              </>
            )}

            {isLoggedIn && role === 'admin' && (
              <>
                <a href="/admin/apartments">Редактировать квартиры</a>
                <a href="/admin/reservations">Редактировать брони</a>
                <a href="/admin/email-templates">Редактировать шаблоны эл. писем</a>
                <a href="/ru/profile">Мой аккаунт</a>
                <a onClick={handleLogout}>Выйти</a>
              </>
            )}
          </nav>
        </div>
      </header>
      {(role !== 'admin') && (
        <div className="logo-sign">
          <Trans
            i18nKey="header.underLogoSign"
            values={{ years: amountOfYears }}
            components={[<br />]}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderComponent;