import { LatLngExpression } from "leaflet";

export default function calculateControlPoints(
  origin,
  destination
): LatLngExpression {
  const latMid = (origin[0] + destination[0]) / 2;
  const lngMid = (origin[1] + destination[1]) / 2;

  const offsetLat = (destination[0] - origin[0]) * 0.2;
  const offsetLng = (destination[1] - origin[1]) * 0.2;

  const controlPoint: LatLngExpression = [
    latMid - offsetLat,
    lngMid + offsetLng,
  ];

  return controlPoint;
}
