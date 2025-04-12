import React, { useEffect } from "react";

const MapComponent = () => {
  useEffect(() => {
    // Делаем initMap доступной глобально
    window.initMap = () => {
      const opt = {
        center: { lat: 46.431522850893, lng: 30.763416193885135 },
        zoom: 15,
      };

      // Создаём карту
      const map = new window.google.maps.Map(
        document.getElementById("map"),
        opt
      );

      // Создаём маркер
      new window.google.maps.Marker({
        position: { lat: 46.431522850893, lng: 30.763416193885135 },
        map: map,
        title: "My location",
      });
    };

    // Загружаем Google Maps API
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDrN63nWdvrqUSEM9kZqHcjB42CC74ILsk&callback=initMap&libraries=maps";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Удаляем скрипт при размонтировании компонента
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="map"></div>;
};

export default MapComponent;

