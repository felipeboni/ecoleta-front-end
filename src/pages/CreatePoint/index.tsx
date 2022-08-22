import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from 'react-router-dom';
import api from '../../services/api'
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios';
import L from "leaflet";

import icon from './constants'

import "./styles.css";
import logo from '../../assets/logo.svg';

interface MapProps {
    [event: string]: any;
}

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGUFResponse {
    sigla: string;
}

interface IBGCityResponse {
    nome: string;
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

    const [ items, setItems ] = useState<Item[]>([]);
    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ cities, setCities ] = useState<string[]>([]);

    const [ selectedUf, setSelectedUf ] = useState('0');
    const [ selectedCity, setSelectedCity ] = useState('0');

    useEffect(() => {
      api.get('items').then(response => {
        setItems(response.data);
      })
    }, [])

    useEffect(() => {
        axios.get<IBGUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla);
                setUfs(ufInitials);
            })
    
    }, [])

    // Load cities when UF changes
    useEffect(() => {
        if (selectedUf === '0') return setCities([])

        axios
            .get<IBGCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome)
                setCities(cityNames)
            })

    }, [selectedUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

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
                            <select
                                name="uf"
                                id="uf"
                                onChange={handleSelectUf}
                                value={selectedUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}

                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                onChange={handleSelectCity}
                                value={selectedCity}
                            >
                                <option value="0">Selecione uma cidade</option>

                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}

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
                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>

            </form>
        </div>
    )
}

export default CreatePoint;