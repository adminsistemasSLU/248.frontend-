import React, {
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const API_Key_Google_Maps =
  process.env.REACT_APP_API_GOOGLE_MAPS || "default_url";

const MapContainer = forwardRef(
  (
    {
      lat: externalLat,
      lon: externalLng,
      direccion: externalDireccion,
      onMarkerDragEnd: externalOnMarkerDragEnd,
      onUpdateLocation,
    },
    ref
  ) => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [open, setOpen] = useState(false);
    const [messageError, setmessageError] = useState("");
    const [address, setAddress] = useState(externalDireccion || "");
    const [position, setPosition] = useState({
      lat: externalLat || -2.1894128,
      lng: externalLng || -79.8890662,
    });

    const mapContainerStyle = {
      width: "100%",
      height: "300px",
      margin: "50px",
    };

    const center = {
      lat: position.lat,
      lng: position.lng,
    };

    const onLoad = useCallback((map) => {
      setMap(map);
    }, []);

    const onMapClick = useCallback(
      (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setMarker({ lat, lng });
        setPosition({ lat, lng });
        externalOnMarkerDragEnd({ lat, lng });
      },
      [externalOnMarkerDragEnd]
    );

    const onMarkerDragEnd = (event) => {
      const { latLng } = event;
      const lat = latLng.lat();
      const lng = latLng.lng();

      setMarker({ lat, lng });
      setPosition({ lat, lng });
      getAddressFromLatLng(lat, lng)
        .then((newAddress) => {
          setAddress(newAddress);
          externalOnMarkerDragEnd({ lat, lng, direccion: newAddress });
        })
        .catch((error) =>
          console.error("Error al obtener la dirección:", error)
        );
    };

    const handleAddressChange = (event) => {
      const newAddress = event.target.value;
      setAddress(newAddress);
      externalOnMarkerDragEnd({
        lat: position.lat,
        lng: position.lng,
        direccion: newAddress,
      });
    };

    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
  
      setOpen(false);
    };

    const handleSearchLocation = () => {
      getLatLngFromAddress(address)
        .then(({ lat, lng }) => {
          onUpdateLocation(lat, lng, address);
          setMarker({ lat, lng });
          setPosition({ lat, lng });
          map.panTo({ lat, lng });
        })
        .catch((error) =>
          console.error("Error al obtener la latitud y longitud:", error)
        );
    };

    const getLatLngFromAddress = async (address) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=` + API_Key_Google_Maps
        );
        const data = await response.json();
          
        if (data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        } else {
          throw new Error(
            "No se encontraron resultados para la dirección proporcionada."
          );
        }
      } catch (error) {
        throw new Error(
          "Error al obtener la latitud y longitud desde la dirección.: ",
          error
        );
      }
    };

    useEffect(() => {
      // Actualizar la dirección cuando cambian las coordenadas
      if (marker) {
        getAddressFromLatLng(marker.lat, marker.lng)
          .then((address) => setAddress(address))
          .catch((error) =>
            console.error("Error al obtener la dirección:", error)
          );
      }
    }, [marker]);

    useEffect(() => {
      setPosition({
        lat: externalLat || -2.1894128,
        lng: externalLng || -79.8890662,
      });
    }, [externalLat, externalLng]);

    useEffect(() => {
      setAddress(externalDireccion || ""); // Actualiza la dirección cuando cambia externamente
    }, [externalDireccion]);

    const getAddressFromLatLng = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=` +
            API_Key_Google_Maps
        );
        let data = await response.json();

        if (data.results.length > 0) {
          return data.results[0].formatted_address;
        } else {
          data = {
            code: 500,
            message: data.error_message,
          };
          setmessageError(data.message)
          setOpen(true);
          return data;
        }
      } catch (error) {
        throw new Error(
          "Error al obtener la dirección desde la latitud y longitud.",
          error
        );
      }
    };

    useImperativeHandle(ref, () => ({
      handleSearchLocation,
    }));

    return (
      <LoadScript googleMapsApiKey={API_Key_Google_Maps}>
        <div>
          <label style={{ display: "none" }}>
            Dirección:
            <input type="text" value={address} onChange={handleAddressChange} />
          </label>
          <button style={{ display: "none" }} onClick={handleSearchLocation}>
            Buscar Ubicación
          </button>
        </div>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="warning">{messageError}</Alert>
        </Snackbar>
        <div>
          <label style={{ display: "none" }}>
            Latitud:
            <input type="text" value={position.lat} readOnly />
          </label>
          <label style={{ display: "none" }}>
            Longitud:
            <input type="text" value={position.lng} readOnly />
          </label>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          onClick={onMapClick}
        >
          {marker && (
            <Marker position={marker} draggable onDragEnd={onMarkerDragEnd} />
          )}
        </GoogleMap>
      </LoadScript>
    );
  }
);

export default MapContainer;
