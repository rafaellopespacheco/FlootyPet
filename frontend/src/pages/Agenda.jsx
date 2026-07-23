import { useEffect } from "react"
import { toast } from "sonner"
import "./Agenda.css"

export default function () {
    useEffect(() => {
        toast.dismiss("Esta página se encontra em desenvolvimento.")
    }, []) 
    
    return (
        <div className="container-main">

    <div className="agenda-card confirmado">

        <div className="card-header">
            <span className="status confirmado">Confirmado</span>
            <span className="horario">09:00 - 11:00</span>
        </div>

        <div className="pet-info">
            <img 
                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" 
                alt="Pet" 
            />

            <div>
                <h3>Mel</h3>
                <p>Vitória Maria</p>
            </div>
        </div>

        <div className="indicadores">

            <span className="ativo">
                <span className="material-symbols-rounded">
                    local_taxi
                </span>
            </span>

            <span className="ativo">
                <span className="material-symbols-rounded">
                    content_cut
                </span>
            </span>

            <span className="pagamento pendente">
                <span className="material-symbols-rounded">
                    payments
                </span>
            </span>

        </div>

    </div>


    <div className="agenda-card agendado">

        <div className="card-header">
            <span className="status agendado">Agendado</span>
            <span className="horario">14:00 - 15:30</span>
        </div>

        <div className="pet-info">
            <img 
                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" 
                alt="Pet" 
            />

            <div>
                <h3>Rex</h3>
                <p>João Silva</p>
            </div>
        </div>

        <div className="indicadores">

            <span>
                <span className="material-symbols-rounded">
                    local_taxi
                </span>
            </span>

            <span className="pagamento pago">
                <span className="material-symbols-rounded">
                    payments
                </span>
            </span>

        </div>

    </div>

</div>
    )
}