import Layout from "./components/Layout";
import Agenda from "./pages/Agenda";
import Atualizacoes from "./pages/Atualizacoes";
import Clientes from "./pages/Cliente";
import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";
import Sobre from "./pages/Sobre";
import InfoCliente from "./pages/InfoCliente";
import CriarNotificacaoForm from "./pages/CriarNotificacaoForm";
import Config from "./pages/Config";
import { useEffect, useState } from "react";

function HomeRedirect() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetch("/api/me")
            .then((res) => {
                setLoggedIn(res.ok);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return null;
    }

    return loggedIn ? (
        <Navigate to="/agenda" replace />
    ) : (
        <Navigate to="/login" replace />
    );
}

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
                    <Route path="/config" element={<Config />}></Route>
                    <Route
                        path="/atualizacoes"
                        element={<Atualizacoes />}
                    ></Route>
                    <Route
                        path="/clientes/:id"
                        element={<InfoCliente />}
                    ></Route>
                    <Route
                        path="/admin/notificacoes/criar"
                        element={<CriarNotificacaoForm />}
                    ></Route>
                </Route>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/sobre" element={<Sobre />}></Route>
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
