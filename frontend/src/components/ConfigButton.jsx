import { NavLink } from "react-router-dom"

export default function ConfigButton () {
   return (
      <div className="configButton">
         {/* Botão Sino */}
         <NavLink className='ButtonAbrirNotificacao' to='/config'><span className="material-symbols-rounded">settings</span></NavLink>
            <button
            className="buttonAbrirNotificacao"
            title="Central de Notificações"
            onClick={() => setIsOpen(!isOpen)}
            >
            </button>

      {/* Dropdown Quick View */}
      </div>
   )
}