import Layout from './components/Layout';
import Agenda from './pages/Agenda';
import Atualizacoes from './pages/Atualizacoes';
import AddAtualizacoes from './pages/AddAtualizacoes';
import Clientes from './pages/Cliente';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/agenda' element={ <Agenda/> }></Route>
                    <Route path='/clientes' element={ <Clientes/> }></Route>
                    <Route path='/atualizacoes' element={ <Atualizacoes/> }></Route>
                    <Route path='/addatualizacoes' element={ <AddAtualizacoes/> }></Route>
                </Route>
                <Route path='/login' element={ <Login/> }></Route>
                {/* <Route path='*' element={ <NotFound/> }></Route> */}
            </Routes>
        </BrowserRouter>
  )
}

export default App;