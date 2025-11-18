import { useState } from "react"
import Authetication from "../Authetication/Authetication"

function Cadastra() {
    const [verificar, setVerificar] = useState<boolean>(false)

    return (
            <Authetication verificar={verificar}/>
    )
}

export default Cadastra