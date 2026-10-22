import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-curve";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";

import calculateControlPoints from "./CalculateControlPoints";

const FitBounds = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, bounds]);

  return null;
};
export default function Map({
  OriginLongitude,
  OriginLatitude,
  DestinationLatitude,
  DestinationLongitude,
}) {
  const OriginSpot: LatLngExpression = [
    Number(OriginLatitude),
    Number(OriginLongitude),
  ];
  const DestinationSpot: LatLngExpression = [
    Number(DestinationLatitude),
    Number(DestinationLongitude),
  ];

  const controlPoint: LatLngExpression = calculateControlPoints(
    OriginSpot,
    DestinationSpot
  );

  const CurveLine = ({ positions }) => {
    const map = useMap();

    useEffect(() => {
      //@ts-ignore
      const path = L.curve(
        ["M", positions[0], "C", positions[1], positions[2], positions[3]],
        { color: "#01ACBC", fill: false }
      ).addTo(map);

      return () => {
        map.removeLayer(path);
      };
    }, [map, positions]);

    return null;
  };

  const DestinationIcon = new L.Icon({
    iconUrl: "images/cargoDetail/destination.svg",
    iconSize: [64, 49], // سایز ایکون
    iconAnchor: [32, 49], //محل افتادن ایکون
  });
  const OriginIcon = new L.Icon({
    iconUrl: "/images/cargoDetail/origin.svg",
    iconSize: [64, 49],
    iconAnchor: [32, 49],
  });
  const bounds = L.latLngBounds([OriginSpot, DestinationSpot]);
  return (
    <MapContainer
      center={controlPoint}
      boxZoom={false}
      zoom={5}
      style={{
        height: "190px",
        width: "100%",
        borderRadius: "16px",
        zIndex: "-1",
      }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      attributionControl={false}
      keyboard={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      <TileLayer
        url="https://tile.openstreetmap.ir/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://openstreetmap.org'>OSM</a> & contributors"
      />
      <Marker position={OriginSpot} icon={OriginIcon}></Marker>

      <Marker position={DestinationSpot} icon={DestinationIcon}></Marker>
      <CurveLine
        positions={[OriginSpot, controlPoint, controlPoint, DestinationSpot]}
      />
      <FitBounds bounds={bounds} />
    </MapContainer>
  );
}
