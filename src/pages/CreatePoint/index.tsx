import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from './constants'

import "./styles.css";
import logo from '../../assets/logo.svg';

interface MapProps {
    [event: string]: any;
}

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [bbox, setBbox] = useState([]);

    const map = useMap();

    useEffect(() => {

        map.locate().on("locationfound", function (event:MapProps) {
            setPosition(event.latlng);

            map.flyTo(event.latlng, map.getZoom());

            const radius = event.accuracy;

            const circle = L.circle(event.latlng, radius);

            circle.addTo(map);

            setBbox(event.bounds.toBBoxString().split(","));
        });
    }, [map]);

    return position === null ? null : (
        <Marker position={position} icon={icon}>
            <Popup>
                Você está aqui!
            </Popup>
        </Marker>
    );
}

const CreatePoint = () => {

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta logo" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para o Início
                </Link>
            </header>

            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                {/* TODO: Image input */}

                <fieldset>
                    <legend><h2>Dados</h2></legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name" />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email" />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp" />
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <MapContainer
                        center={[-15.7997171, -47.8662228]}
                        zoom={13}
                        scrollWheelZoom
                        >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <LocationMarker />
                    </MapContainer>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Óleo" />
                            <span>Óleo de cozinha</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Óleo" />
                            <span>Óleo de cozinha</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Óleo" />
                            <span>Óleo de cozinha</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Óleo" />
                            <span>Óleo de cozinha</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Óleo" />
                            <span>Óleo de cozinha</span>
                        </li>

                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Óleo" />
                            <span>Óleo de cozinha</span>
                        </li>
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>

            </form>
        </div>
    )
}

export default CreatePoint;