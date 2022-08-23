import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate  } from 'react-router-dom';
import api from '../../services/api'
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios';
import L from "leaflet";
import toast, { Toaster } from 'react-hot-toast';

import { UserIcon, PointIcon } from './constants'

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

const CreatePoint = () => {

    const [ items, setItems ] = useState<Item[]>([]);
    const [ ufs, setUfs ] = useState<string[]>([]);
    const [ cities, setCities ] = useState<string[]>([]);

    const [ selectedUf, setSelectedUf ] = useState('0');
    const [ selectedCity, setSelectedCity ] = useState('0');
    const [ selectedItems, setSelectedItems ] = useState<number[]>([]);

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [position, setPosition] = useState<[number, number]>([-15.7997171, -47.8662228]);
    
    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const navigate = useNavigate();

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

    
    function CurrentLocation() {
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
            <Marker position={position} icon={UserIcon}>
                <Popup>
                    Você está aqui!
                </Popup>
            </Marker>
        );
    }

    function Markers() {
        useMapEvents({
            click(e) {                                
                setSelectedPosition([
                    e.latlng.lat,
                    e.latlng.lng
                ]);                
            },            
        })

        return (
            selectedPosition ? 
                <Marker           
                    key={selectedPosition[0]}
                    position={selectedPosition}
                    interactive={false} 
                    icon={PointIcon}
                />
            : null
        )   
        
    }

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [ name ]: value
        });
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            return setSelectedItems(filteredItems);
        }
        
        setSelectedItems([...selectedItems, id])
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [ latitude, longitude ] = selectedPosition
        const items = selectedItems;

        const requestData = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        const fetchData = async (requestData: object) => {
            const response = await api.post('points', requestData);
            console.log({ response });

            const { status } = response;

            setTimeout(() => {
                status === 200 ?
                navigate("/", { replace: true }) :
                null
            }, 5000);

            return response;
        };

        const callFunction = fetchData(requestData);

        toast.promise(
            callFunction,
            {
              loading: 'Criando o ponto de coleta...',
              success: () => `${requestData.name} foi criado com sucesso!`,
              error: (err) => `Ops! Ocorreu um erro: ${err.toString()}`,
            },
            {
            duration: 5000,
              style: {
                minWidth: '250px',
              },
            }
        );

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

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                {/* TODO: Image input */}

                <fieldset>
                    <legend><h2>Dados</h2></legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name" 
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email" 
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <MapContainer
                        center={position}
                        zoom={13}
                        scrollWheelZoom
                        >
                        <Markers />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        <CurrentLocation />
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
                            <li
                                key={item.id}
                                onClick={() => { handleSelectItem(item.id) }}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>

            </form>

            <Toaster />
        </div>
    )
}

export default CreatePoint;