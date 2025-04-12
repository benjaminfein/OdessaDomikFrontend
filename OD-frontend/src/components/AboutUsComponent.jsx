import React, { useEffect, useState } from 'react';

const AboutUsComponent = () => {
    return (
        <div className="my-page">
            <div className="about-us-container">
                <section className="about-natalia">
                    <div className="about-natalia-content">
                        <h2 className="about-natalia-title">Здравствуйте! Мы рады приветствовать Вас на нашем сайте посуточной аренды.</h2>
                        <p className="about-natalia-text">Апартаменты, которые мы предлагаем расположены в ТОП локации Одессы. Курортный район, Аркадия. Первая линия от моря.<br></br>
                        </p>
                        <a className="about-more-button" href="https://maps.app.goo.gl/DhNzzfZ9bMrYNzSd8">Больше про Аркадию...</a>
                    </div>
                    <img className="about-natalia-img" src="https://gagarinnplaza.com/uploads/image/dekstop1__1732279432401.png" style={{width: '878px', height: '494px'}} />
                </section>
                <section className="about-natalia">
                    <img className="about-natalia-img" src="https://live.staticflickr.com/65535/54393299799_9d4e2e8ed4_b.jpg" style={{width: '534px', height: '800px'}} />
                    <div className="about-natalia-content">
                        <h2 className="about-natalia-title">Новый жилой комплекс Гагарин Плаза. Большая закрытая территория, подземный паркинг.</h2>
                        <p className="about-natalia-text">Пешком до моря 5-6 минут. Рядом с нашим комплексом торговый центр, кафе, рестораны. Аквапарк и казино. 
                            Ночные клубы и детский развлекательный комплекс. Большая парковая зона.<br></br>
                        </p>
                    </div>
                </section>
                <section className="about-natalia">
                    <div className="about-natalia-content">
                        <h2 className="about-natalia-title">Удобная транспортная развязка, конечная маршрутных такси и городского транспорта.</h2>
                        <p className="about-natalia-text">Апартаменты разные по площади и могут отличаться количеством спальных мест и видом. В основном они идут с панорамным остеклением. 
                            Есть с красивым видом на город и Аркадию. Есть так же с потрясающим видом на море!<br></br>
                        </p>
                    </div>
                    {/* <img className="about-natalia-img" src="https://gagarinnplaza.com/uploads/image/dekstop1__1732279432401.png" /> */}
                </section>
            </div>
        </div>
    );
};

export default AboutUsComponent;
