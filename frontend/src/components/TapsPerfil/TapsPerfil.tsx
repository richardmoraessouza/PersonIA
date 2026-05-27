import { useState } from "react";
import CardCharacterUser from "../CardCharacterUser/CardCharacterUser";
import CardFavorites from "../CardFavorites/CardFavorites";

const TapsPerfil = () => {
    const [abaAtiva, setAbaAtiva] = useState<string>('Personagens');

    return (
        <section className="w-full flex justify-center items-center gap-7 mb-4 text-sm flex-col">
            <nav className="w-full flex justify-center items-center gap-4 mb-4 text-sm text-gray-400">
                
                {/* Botão Personagens */}
                <button 
                    onClick={() => setAbaAtiva('Personagens')} 
                    className={`transition-colors duration-200 cursor-pointer ${
                        abaAtiva === 'Personagens' ? 'text-[#FFF]' : '#FFF'
                    }`}
                >
                    Personagens
                </button>
        
                {/* Botão Favoritos */}
                <button 
                    onClick={() => setAbaAtiva('Favoritos')} 
                    className={`transition-colors duration-200 cursor-pointer ${
                        abaAtiva === 'Favoritos' ? 'text-[#FFF]' : '#FFF'
                    }`}
                >
                    Favoritos
                </button>

                {/* Botão Recentes */}
                <button 
                    onClick={() => setAbaAtiva('Recentes')} 
                    className={`transition-colors duration-200 cursor-pointer ${
                        abaAtiva === 'Recentes' ? 'text-[#FFF]' : '#FFF'
                    }`}
                >
                    Recentes
                </button>
            </nav>

            {/* Renderização condicional dos componentes */}
            {abaAtiva === 'Personagens' && <CardCharacterUser/>}
            {abaAtiva === 'Favoritos' && <CardFavorites />}
            {/* Quando você criar o componente de Recentes, só descomentar a linha abaixo: */}
            {/* {abaAtiva === 'Recentes' && <CardRecents />} */}
        </section>
    )
}

export default TapsPerfil;