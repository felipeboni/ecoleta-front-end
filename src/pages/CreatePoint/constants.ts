import L from "leaflet";
import user_pin from '../../assets/map_pin.png'
import point_pin from '../../assets/point_pin.png'

const UserIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: user_pin,
})

const PointIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: point_pin,
})

export {UserIcon, PointIcon}