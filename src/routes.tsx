import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const Navigation = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-point" element={<CreatePoint />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Navigation;