import { ReactSVG } from 'react-svg';
import Search from '../components/search';
import React, { ChangeEvent, useEffect, useState } from 'react';

type header = {
    name: string;
    functionSearch: (e:ChangeEvent<HTMLInputElement>)=>void;
    ShowTop: ()=>void;
};

export type userToken = {
    name: string;
    email: string;
    photo: string;
    role: number;
}

export default function Header ({name, functionSearch, ShowTop}:header){

    const [seeHeader, setSeeHeader] = useState(true);
    const [userData, setUserData] = useState<userToken>();

    useEffect(()=>{
        const user = localStorage.getItem("user");
        
        if(user) {
            console.log(JSON.parse(user))
            setUserData(JSON.parse(user));
        };
    },[])
    

    return(
        <header className={`relative w-full max-sm:justify-between flex items-center bg-6 px-7 transition-all duration-300 ${seeHeader?'h-[200px] sm:h-[130px]':'h-5'}`} >
            {seeHeader && userData?(
                <React.Fragment>
                    <div className='flex items-center w-[30%] gap-15' >
                        <img className='md:hidden w-[80px] h-[80px]' src='/src/assets/img/kbr.png' alt='Logo da KBR' />
                        <ReactSVG
                            className="max-md:hidden"
                            src="/src/assets/svg/image 1.svg"
                        />
                        <div className='flex items-center gap-5 max-xl:hidden' >
                            <ReactSVG
                                className=""
                                src="/src/assets/svg/Group 1.svg"
                            />
                            <h1 className='text-white text-[24px] font-bold' >{name}</h1>
                        </div>
                    </div>
                    <div className='flex items-center w-[70%] sm:pl-15 justify-between max-2xl:justify-end max-2xl:gap-10 max-md:gap-3 max-sm:w-[250px] max-sm:flex-wrap' >
                        <div className='w-[44.26%] min-w-[200px]' >
                            <Search onClickSearch={()=>{}} onchange={functionSearch} placeholder='Pesquisar'/>
                        </div>
                        <div className='flex items-center gap-3 sm:gap-5' >
                            <ReactSVG
                                className="cursor-pointer hover:scale-105 transition-all duration-300"
                                src="/src/assets/svg/Bell.svg"
                            />
                            <ReactSVG
                                className="cursor-pointer hover:scale-105 transition-all duration-300"
                                src="/src/assets/svg/mail.svg"
                            />
                        </div>
                        <div className='gap-3 flex items-center text-white cursor-pointer'>
                            <div className='flex flex-col text-[20px] font-semibold max-w-[145px] truncate text-end max-lg:hidden' >
                                <p className='' >Olá,</p>
                                <p className='truncate' >{userData.name}</p>
                            </div>
                            <div className='relative flex items-center justify-center w-[55px] h-[55px] sm:w-[69px] sm:h-[69px] rounded-full bg-white ' >
                                <img className='w-[38px] h-[38px] sm:w-12 sm:h-12' src={userData.photo?userData.photo:"/src/assets/img/User.png"} alt="Perfil" />
                                <div className='absolute right-[-5px] sm:right-[-10px] bottom-0 flex items-center justify-center w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-black' >
                                    <ReactSVG
                                        className="cursor-pointer hover:scale-105 transition-all duration-300"
                                        src="/src/assets/svg/config.svg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cursor-pointer hidden max-2xl:flex justify-center items-center absolute right-0 bottom-[-15px] w-8 h-8 bg-3 rounded-full">
                        <ReactSVG
                            className="rotate-[30deg] text-white"
                            src="/src/assets/svg/play_arrow_filled.svg"
                            onClick={() => {
                                setSeeHeader(false);
                                ShowTop();
                            }}
                        />
                    </div>
                </React.Fragment>
            ):(
                <div className="cursor-pointer flex justify-center items-center absolute right-0 bottom-[-15px] w-8 h-8 bg-3 rounded-full">
                        <ReactSVG
                            className="rotate-[90deg] text-white"
                            src="/src/assets/svg/play_arrow_filled.svg"
                            onClick={() => {
                                setSeeHeader(true);
                                ShowTop();
                            }}
                        />
                </div>
            )}
        </header>
    );
}