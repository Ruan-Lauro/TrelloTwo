import React from 'react';
import { ReactSVG } from 'react-svg';

type buttoMenuLeft = {
    name: string;
    autentication: ()=>void;
    namePassed: string;
    urlIcon: string;
};  

export default function ButtonMenuLeft ({
    name,
    autentication,
    namePassed,
    urlIcon,
}:buttoMenuLeft){

    return(
        <React.Fragment >
            {name === namePassed?(
                <div className='cursor-pointer bg-4 h-[60px] flex items-center justify-between w-[90%] rounded-full px-5' onClick={autentication} >
                    <div className='flex items-center gap-3'>
                        <ReactSVG
                            className=""
                            src={urlIcon}
                        />
                        <h2 className='text-white font-bold' >{name}</h2>
                    </div>
                    <ReactSVG
                        className="justify-self-end text-white"
                        src="/src/assets/svg/icon (1).svg"
                    />
                </div>
            ):(
                <div className='bg- hover:bg-3 h-[60px] flex items-center justify-between w-[90%] pl-6 pr-4 rounded-full cursor-pointer' onClick={autentication} >
                    <div className='flex items-center gap-3'>
                        <ReactSVG
                            className=""
                            src={urlIcon}
                        />
                        <h2 className='text-white font-bold' >{name}</h2>
                    </div>
                    <ReactSVG
                        className="justify-self-end text-white"
                        src="/src/assets/svg/play_arrow_filled.svg"
                    />
                </div>
            )}
        </React.Fragment>
    );  
};   