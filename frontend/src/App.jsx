import Layout from './components/Layout';
import Agenda from './pages/Agenda';
import Atualizacoes from './pages/Atualizacoes';
import AddAtualizacoes from './pages/AddAtualizacoes';
import Clientes from './pages/Cliente';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import Sobre from './pages/Sobre';


function App() {
    return (
        <BrowserRouter>
            <Toaster
                richColors
                expand={true}
                toastOptions={{
                    style: {
                        fontSize: "1.2em",
                    },
                }}
            />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/agenda" element={<Agenda />}></Route>
                    <Route path="/clientes" element={<Clientes />}></Route>
                    <Route
                        path="/atualizacoes"
                        element={<Atualizacoes />}
                    ></Route>
                    <Route
                        path="/addatualizacoes"
                        element={<AddAtualizacoes />}
                    ></Route>
                </Route>
                <Route path="/" element={<Login />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/sobre" element={<Sobre />}></Route>
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;