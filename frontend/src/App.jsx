import Layout from './components/Layout';
import Agenda from './pages/Agenda';
import Atualizacoes from './pages/Atualizacoes';
import Clientes from './pages/Cliente'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
    return (
        <BrowserRouter basename='/v2'>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/agenda' element={ <Agenda/> }></Route>
                    <Route path='/clientes' element={ <Clientes/> }></Route>
                    <Route path='/atualizacoes' element={ <Atualizacoes/> }></Route>
                </Route>
            </Routes>
        </BrowserRouter>
  )
}

export default App;