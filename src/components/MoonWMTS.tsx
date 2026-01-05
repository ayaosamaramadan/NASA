
import { MapContainer, TileLayer } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

const MoonMap = () => {
  return (
    <MapContainer
      center={[-150, 20]}  
         zoom={3}      
      style={{ height: "100vh", width: "100%" }}
      minZoom={2}
      maxZoom={6}
      zoomControl={false}
      crs={L.CRS.Simple}
      >
    <div
        className="leaflet-control-zoom leaflet-bar"
        style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}
    >
        <button className="z-50 leaflet-control-zoom-in">+</button>
        <button className="z-50 leaflet-control-zoom-out">−</button>
    </div>
      <TileLayer className="-z-50"
        url="https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-moon-basemap-v0-1/all/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://nasa.gov">NASA</a>'
        tms={false}
        noWrap={true}
      />
    </MapContainer>
  );
};

export default MoonMap;
