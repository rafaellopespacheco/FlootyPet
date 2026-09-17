import Sidebar from "./Sidebar";
import Header from "./Header";
import ConfigSidebar from "./ConfigSidebar";
import { Outlet, useLocation } from "react-router-dom";
import NovoAgendamentoGlobal from "./NovoAgendamentoGlobal";

export default function () {
    const location = useLocation();
    const isConfig = location.pathname.startsWith("/config");

    return (
        <>
            {isConfig ? <ConfigSidebar /> : <Sidebar />}
            <main>
                <Header />
                <Outlet />
                <NovoAgendamentoGlobal />
            </main>
        </>
    );
}
