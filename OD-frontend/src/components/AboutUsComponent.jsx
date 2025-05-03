import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ScrollToTopButtonComponent from './ScrollToTopButtonComponent';

const AboutUsComponent = () => {
    const { t, ready } = useTranslation();
    const currentYear = new Date().getFullYear();
    const amountOfYears = currentYear - 2008;

    if (!ready) return null;

    return (
        <div className="my-page">
            <div className="about-us-container">
                <div className="about-us-contacts">
                    <a href="https://www.instagram.com/natali_leskova_nedvijimost/">
                        <img className="about-us-img" src="https://www.svgrepo.com/show/458242/insta.svg" alt="Instagram" />
                        <div className="about-us-explanation">
                            {t('aboutUs.ourInstagram')}
                        </div>
                    </a>
                    <a href="tel:+380634487370">
                        <img src="https://www.svgrepo.com/show/518544/phone.svg" alt="Номер телефона" className="about-us-img" />
                        <div className="about-us-explanation">
                            {t('aboutUs.ourPhoneNumber')}
                        </div>
                    </a>
                </div>
                <div className="about-us-text">
                    <Trans
                        i18nKey="aboutUs.text"
                        values={{ years: amountOfYears }}
                        components={[<br />]}
                    />
                </div>
            </div>
            <ScrollToTopButtonComponent />
        </div>
    );
};

export default AboutUsComponent;
