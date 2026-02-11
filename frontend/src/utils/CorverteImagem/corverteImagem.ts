// Função para converter imagem para Base64
export function converterBase64(e: React.ChangeEvent<HTMLInputElement>, setState?: (value: string) => void) {
    const file = e.target.files?.[0];
    if (file) {
        const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
        if (!tiposPermitidos.includes(file.type)) {
            alert("Apenas imagens PNG ou JPEG são permitidas!");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (setState) {
                setState(base64);
            }
        };
        reader.readAsDataURL(file);
    }
}

export function converterFigurinha(e: React.ChangeEvent<HTMLInputElement>, index: number, figurinhas: string[], setFigurinhas: (value: string[]) => void) {
    const file = e.target.files?.[0];
    if (file) {
        const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
        if (!tiposPermitidos.includes(file.type)) {
            alert("Apenas imagens PNG, JPEG ou WEBP são permitidas!");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const novasFigurinhas = [...figurinhas];
            novasFigurinhas[index] = reader.result as string;
            setFigurinhas(novasFigurinhas);
        };
        reader.readAsDataURL(file);
    }
}
