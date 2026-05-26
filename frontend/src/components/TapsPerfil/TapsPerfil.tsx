import { useState } from "react";
import CardCharacterUser from "../CardCharacterUser/CardCharacterUser";
import CardFavorites from "../CardFavorites/CardFavorites";

const TapsPerfil = () => {
    const [abaAtiva, setAbaAtiva] = useState<string>('Personagens');

    return (
        <section className="w-full flex justify-center items-center gap-7 mb-4 text-sm flex-col">
            <nav className="w-full flex justify-center items-center gap-4 mb-4 text-sm text-gray-400">
                <button onClick={() => setAbaAtiva('Personagens')} className="hover:text-gray-200 transition-colors duration-200 cursor-pointer">
                    Personagens
                </button>
        
                <button onClick={() => setAbaAtiva('Favoritos')} className="hover:text-gray-200 transition-colors duration-200 cursor-pointer">
                    Favoritos
                </button>

                <button onClick={() => setAbaAtiva('Seguindo')} className="hover:text-gray-200 transition-colors duration-200 cursor-pointer">
                    Seguindo
                </button>
            </nav>
            {abaAtiva === 'Personagens' && <CardCharacterUser/>}
            {abaAtiva === 'Favoritos' && <CardFavorites />}
        </section>
    )
}

export default TapsPerfil;





