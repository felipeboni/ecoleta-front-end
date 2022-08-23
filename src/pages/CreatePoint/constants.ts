import L from "leaflet";
import pin from '../../assets/map_pin.png'

const UserIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: pin,
})

const PointIcon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: pin,
})

export {UserIcon, PointIcon}