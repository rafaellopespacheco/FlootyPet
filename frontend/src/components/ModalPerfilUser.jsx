import { useState, useEffect } from "react";
import "./ModalPerfilUser.css"
import buscarUsuario from "../services/profile";


export default function ModalPerfilUser ({ onClose }) {
      const [usuario, setUsuario] = useState(null);
      
      useEffect(() => {
         async function carregar() {
            const dados = await buscarUsuario();
            setUsuario(dados)
         }

         carregar()
      }, [])
      
   return (
      <div className="container-modalperfiluser">
         <div className="modalperfiluser">
            <div className="headermodal">
               <p>Meu Perfil</p>
               <button className="closeButton" onClick={onClose}>&times;</button>
               </div>
            <hr />
            <img src="https://i.pinimg.com/originals/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg" alt=""></img>
            <label htmlFor="nome">Nome</label>
            <input type="text" name="nome" value={usuario?.nome}/>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="" value={usuario?.email}/>
            <button disabled className="button">Salvar  (em  breve)</button>
         </div>
      </div>
   )
}