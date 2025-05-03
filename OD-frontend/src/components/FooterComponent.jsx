import React from 'react'
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const FooterComponent = () => {
  const { t, ready } = useTranslation();

  if (!ready) return null;

  return (
    <footer className="my-footer">
      <div className="footer-content">
        <div className="footer-section logo-section">
          <h3>OdessaDomik</h3>
          <p>{t('footer.description')}</p>
        </div>

        <div className="footer-section links-section">
          <h4>{t('footer.navigation')}</h4>
          <ul>
            <li><a href={`/${i18n.language}/`}>{t('footer.main')}</a></li>
            <li><a href={`/${i18n.language}/about-us`}>{t('footer.about')}</a></li>
            <li><a href={`/${i18n.language}/apartments`}>{t('footer.apartments')}</a></li>
            <li><a href={`/${i18n.language}/profile`}>{t('footer.profile')}</a></li>
          </ul>
        </div>

        <div className="footer-section legal-section">
          <h4>{t('footer.legal')}</h4>
          <ul>
            <li><a href={`/${i18n.language}/privacy-policy`}>{t('footer.privacyPolicy')}</a></li>
            <li><a href={`/${i18n.language}/terms-of-use`}>{t('footer.terms')}</a></li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h4>{t('footer.contacts')}</h4>
          <a href="tel:+380634487370">+38 (063) 448 73 70</a><br />
          <a href="https://www.instagram.com/natali_leskova_nedvijimost/" target="_blank" rel="noopener noreferrer">
            <img src="https://www.svgrepo.com/show/458242/insta.svg" alt="Instagram" className="insta-icon" />
            Instagram
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© OdessaDomik {new Date().getFullYear()}. {t('footer.rights')}</span>
      </div>
    </footer>
  )
}

export default FooterComponent