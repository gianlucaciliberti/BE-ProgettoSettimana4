import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [41.9028, 12.4964];

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function RecenterMap({ position, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, zoom);
    }
  }, [position, zoom, map]);

  return null;
}

function LocationPicker({ latitude, longitude, address, onChange }) {
  const [addressInput, setAddressInput] = useState(address || "");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setAddressInput(address || "");
  }, [address]);

  const hasPosition = latitude != null && longitude != null;
  const position = hasPosition ? [latitude, longitude] : null;

  const reverseGeocode = async (lat, lng) => {
    onChange({ latitude: lat, longitude: lng, address: addressInput });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const found = data?.display_name || "";

      setAddressInput(found);
      onChange({ latitude: lat, longitude: lng, address: found });
    } catch {
      // se il servizio di geocoding non risponde restano solo le coordinate
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!addressInput.trim()) {
      return;
    }

    setSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          addressInput
        )}`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];

        setAddressInput(display_name);
        onChange({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          address: display_name,
        });
      }
    } finally {
      setSearching(false);
    }
  };

  const handleRemove = () => {
    setAddressInput("");
    onChange({ latitude: null, longitude: null, address: "" });
  };

  return (
    <div className="location-picker">
      <div className="location-search">
        <input
          type="text"
          placeholder="Cerca un indirizzo"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
        />

        <button type="button" onClick={handleSearch} disabled={searching}>
          {searching ? "Cerco..." : "Cerca"}
        </button>

        {hasPosition && (
          <button type="button" className="cancel-button" onClick={handleRemove}>
            Rimuovi posizione
          </button>
        )}
      </div>

      <div className="map-container">
        <MapContainer
          center={position || DEFAULT_CENTER}
          zoom={hasPosition ? 14 : 5}
          style={{ height: "260px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler onPick={reverseGeocode} />
          <RecenterMap position={position} zoom={14} />

          {hasPosition && (
            <Marker
              position={position}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  reverseGeocode(lat, lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <p className="location-hint">
        Clicca sulla mappa o cerca un indirizzo per associare una posizione al post (facoltativo).
      </p>
    </div>
  );
}

export default LocationPicker;
