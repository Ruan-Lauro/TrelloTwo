import React from "react";

const ImgUser = ({img, nome, id, color, textColor}:{img:string, nome: string, id: number, color: string, textColor?: string}) => {
    return(
        <React.Fragment key={id} >
            {img?(
                <img className="w-[44px] h-[44px] rounded-full object-cover" src={img} alt={`Foto de ${nome}`} />
            ):( 
                <div className={`${color} w-[44px] h-[44px] rounded-full flex items-center justify-center`} aria-label={nome} >
                    <p className={`text-[30px] font-bold ${textColor?textColor:"text-white"}`} >{nome[0]}</p>
                </div>
            )}
        </React.Fragment>
    );
};

export default ImgUser;