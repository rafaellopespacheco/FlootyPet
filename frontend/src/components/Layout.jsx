import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function () {
    return (
        <>
            <Sidebar />
            <main>
                <Header />
                <Outlet />
            </main>
        </>
    );
}
