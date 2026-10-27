import React from "react";

import "./Map.css";

// Keyless OpenStreetMap embed; the iframe only loads when the map is shown
const Map = (props) => {
  const { lat, lng } = props.center;
  const delta = props.delta || 0.01;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join(",");

  return (
    <div className={`map ${props.className || ""}`}>
      <iframe
        title={props.title || "Map"}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
          bbox
        )}&layer=mapnik&marker=${lat},${lng}`}
        loading="lazy"
      />
      <a
        className="map__link"
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
        target="_blank"
        rel="noreferrer"
      >
        Open larger map
      </a>
    </div>
  );
};

export default Map;
