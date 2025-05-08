import React, { useState } from "react";

const ImgUser = ({ img, nome, id, color, textColor, size }: { img?: string, nome: string, id: number, color: string, textColor?: string, size?: string }) => {
    const [erroNaImagem, setErroNaImagem] = useState(false);
    const imagemURL = img ? import.meta.env.VITE_LINK_API + img : "";

    const renderFallback = () => (
        <div className={`${color} ${size ? size : "w-[44px] h-[44px]"} rounded-full flex items-center justify-center`} aria-label={nome}>
            <p className={`${size ? "" : "text-[30px]"} font-bold ${textColor ? textColor : "text-white"}`}>{nome[0]}</p>
        </div>
    );

    return (
        <React.Fragment key={id}>
            {img && !erroNaImagem ? (
                <img
                    className={`${size ? size : "w-[44px] h-[44px]"} rounded-full object-cover`}
                    src={imagemURL}
                    alt={`Foto de ${nome}`}
                    onError={() => setErroNaImagem(true)}
                />
            ) : (
                renderFallback()
            )}
        </React.Fragment>
    );
};

export default ImgUser;
