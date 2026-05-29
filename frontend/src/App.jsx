import Layout from './components/Layout';
import Agenda from './pages/Agenda';
import Clientes from './pages/Cliente'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
    return (
        <BrowserRouter basename='/v2'>
            <Routes>
                <Route element={<Layout />}>
                    <Route path='/agenda' element={ <Agenda/> }></Route>
                    <Route path='/clientes' element={ <Clientes/> }></Route>
                </Route>
            </Routes>
        </BrowserRouter>
  )
}

export default App;