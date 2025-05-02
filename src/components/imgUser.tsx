import React from "react";

const ImgUser = ({img, nome, id, color, textColor, size}:{img?:string, nome: string, id: number, color: string, textColor?: string, size?: string}) => {
    return(
        <React.Fragment key={id} >
            {img?(
                <img className={`${size?size:"w-[44px] h-[44px]"} rounded-full object-cover`} src={import.meta.env.VITE_LINK_API+img} alt={`Foto de ${nome}`} />
            ):( 
                <div className={`${color} ${size?size:"w-[44px] h-[44px]"} rounded-full flex items-center justify-center`} aria-label={nome} >
                    <p className={`${size?"":"text-[30px]"} font-bold ${textColor?textColor:"text-white"}`} >{nome[0]}</p>
                </div>
            )}
        </React.Fragment>
    );
};

export default ImgUser;