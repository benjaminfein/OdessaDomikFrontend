import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const MapComponent = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    window.initMap = () => {
      const opt = {
        center: { lat: 46.431522850893, lng: 30.763416193885135 },
        zoom: 15,
      };
  
      const map = new window.google.maps.Map(
        document.getElementById("map"),
        opt
      );
  
      new window.google.maps.Marker({
        position: { lat: 46.431522850893, lng: 30.763416193885135 },
        map: map,
        title: "My location",
      });
    };

    let langCode = i18n.language.toLowerCase();

    if (langCode.startsWith('ua')) {
      langCode = 'uk';
    } else {
      langCode = langCode.slice(0, 2);  // Берем только первые две буквы
    }
  
    const existingScript = document.getElementById('googleMapsScript');
    if (existingScript) {
      existingScript.remove();
    }
  
    const script = document.createElement("script");
    script.id = "googleMapsScript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDrN63nWdvrqUSEM9kZqHcjB42CC74ILsk&callback=initMap&libraries=maps&language=${i18n.language}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, [i18n.language]);  

  return <div id="map"></div>;
};

export default MapComponent;