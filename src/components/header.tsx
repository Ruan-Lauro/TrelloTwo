import { ReactSVG } from 'react-svg';
import Search from '../components/search';
import { ChangeEvent } from 'react';

type header = {
    name: string;
    functionSearch: (e:ChangeEvent<HTMLInputElement>)=>void;

};

export default function Header ({name, functionSearch}:header){
    return(
        <header className="w-full h-[200px] sm:h-[130px] max-sm:justify-between flex items-center bg-6 px-7" >
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
                    <p className='text-[20px] font-semibold max-w-[143px] text-end max-lg:hidden' >Olá, Administrador</p>
                    <div className='relative flex items-center justify-center w-[55px] h-[55px] sm:w-[69px] sm:h-[69px] rounded-full bg-white ' >
                        <img className='w-[38px] h-[38px] sm:w-12 sm:h-12' src="/src/assets/img/User.png" alt="Perfil" />
                        <div className='absolute right-[-5px] sm:right-[-10px] bottom-0 flex items-center justify-center w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-black' >
                            <ReactSVG
                                className="cursor-pointer hover:scale-105 transition-all duration-300"
                                src="/src/assets/svg/config.svg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}