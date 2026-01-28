import { MapContainer, TileLayer } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import ZoomControls from "./hooks/ZoomControls";
import CustomCursor from "./hooks/CustomCursor";
import "../styles/ol.css"
import TypeMap from "./hooks/TypeMap";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";

const MoonMap = () => {

  const { MapUrl } = useSelector((state: RootState) => state.map);
  return (
    <>

      <MapContainer
        center={[-150, 20]}
        zoom={2}
        style={{ height: "100vh", width: "100%" }}

        zoomControl={false}
        crs={L.CRS.Simple}
      >
        <TypeMap />
        <ZoomControls />
        <CustomCursor />
        {/* <CursorControl /> */}

        <TileLayer className="-z-50"
          url={`https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-${MapUrl}-basemap-v0-1/all/{z}/{x}/{y}.png`}
          attribution='&copy; <a href="https://nasa.gov">NASA</a>'
          tms={false}
          noWrap={true}
        />
      </MapContainer></>
  );
};

export default MoonMap;
