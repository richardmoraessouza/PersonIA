import { useState } from "react"
import Authetication from "../Authetication/Authetication"

function Entrar() {
    const [verificar, setVerificar] = useState<Boolean>(true)

    return (
        <>
        <Authetication verificar={verificar}/>
        </>
    )
}

export default Entrar