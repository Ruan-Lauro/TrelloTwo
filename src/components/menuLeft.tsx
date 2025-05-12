import  { useState } from 'react';
import ButtonMenuLeft from './buttonMenuLeft';
import SelectMenuLeft from './selectMenuLeft';
import { ReactSVG } from 'react-svg';
import { useNavigate } from 'react-router-dom';

type menuLeft = {
    nameLocal: string;
    ShowLeft: ()=>void;
    isAdmin: boolean;
};

export default function MenuLeft({nameLocal, ShowLeft, isAdmin}:menuLeft) {

  const [seeMenuLeft, setSeeMenuLeft] = useState(true);
  const navigate = useNavigate();

  return (
    <section
        className={`z-3 relative flex flex-col items-center h-full bg-2 pt-10 gap-3 transition-all duration-300 ${
          seeMenuLeft ? "w-[250px] md:w-[326px]" : "w-[20px]"
        }`}
      >
        {seeMenuLeft ? (
          <>
            <ButtonMenuLeft
              autentication={() => {
                navigate('/Dashboard');
              }}
              name={"Dashboard"}
              namePassed={nameLocal}
              urlIcon="/src/assets/svg/Home.svg"
            />
            <SelectMenuLeft name={nameLocal} isAdmin={isAdmin}/>
            <ButtonMenuLeft
              autentication={() => {
                navigate('/Mensagens');
              }}
              name={"Mensagens"}
              namePassed={nameLocal}
              urlIcon="/src/assets/svg/icon.svg"
            />
            {isAdmin?(
              <ButtonMenuLeft
                autentication={() => {
                  navigate('/Usuarios');
                }}
                name={"Usuários"}
                namePassed={nameLocal}
                urlIcon="/src/assets/svg/Icon@2x.svg"
              />
            ):null}
            
            <div className='w-full hidden max-2xl:flex justify-center' >
                <ButtonMenuLeft
                autentication={() => {
                    setSeeMenuLeft(false);
                    ShowLeft();
                }}
                name={"Fechar Menu"}
                namePassed={nameLocal}
                urlIcon="/src/assets/svg/X.svg"
                />
            </div>
          </>
        ) : (
          <div className="cursor-pointer flex justify-center items-center absolute right-[-15px] w-8 h-8 bg-3 rounded-full">
            <ReactSVG
              className="justify-self-end text-white"
              src="/src/assets/svg/play_arrow_filled.svg"
              onClick={() => {
                setSeeMenuLeft(true);
                ShowLeft();
              }}
            />
          </div>
        )}
      </section>
  );
}
