import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route path="/" element={<Home />} />
            <Route path="/create-point" element={<CreatePoint />} />
        </BrowserRouter>
    )
}

export default Routes;