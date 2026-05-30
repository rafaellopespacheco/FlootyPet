import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';

export default function () {
    return (
        <>
            <Sidebar />
            <main>
                <Header />
                <Outlet />
                <Toaster richColors expand={true} toastOptions={{
                    style: {
                        fontSize: "1.2em"
                    }
                }}/>
            </main>
        </>
    );
}
