import { ReactSVG } from 'react-svg';
import Input from '../components/input';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Button from '../components/button';
import Form from '../components/form';
import { useNavigate } from "react-router-dom";
import { useAuthLogin } from '../hooks/useAuthLogin';
import { useAuthToken } from '../hooks/useAuthToken';
import { useGetUser } from '../hooks/useGetUser';



function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const {authenticationLogin} = useAuthLogin();
  // const {editCard} = useGetCard();
  const {authenticationT} = useAuthToken();
  const {getUser} = useGetUser();


  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token && token !== ""){
      const resToken = authenticationT(token);
      resToken.then(value=>{
        console.log(value)
        // if(value){
        //   navigate("/Dashboard")
        // }
      });
    }
  },[])

  const authentication = async (e: FormEvent) =>{
    e.preventDefault();
    const res = await authenticationLogin(email, password);
    if(res === "Unauthorized"){
      return setErro("E-mail ou senha errada");
    }else if(res === "login erro"){
      return setErro("Algo está errado na requisição");
    }else if(res === "servidor erro" || res === undefined){
      return setErro("Erro no servidor");
    }

    setErro("");

    const resToken = await authenticationT(res);
      if( resToken && typeof resToken === "boolean"){
        console.log(res);
        localStorage.setItem("token", res);
        const resGetUser = await getUser(res);
        if( resGetUser &&typeof resGetUser !== "string" && resGetUser.name){
          localStorage.setItem("user", JSON.stringify(resGetUser));
          navigate("/Dashboard")
        }
      }

  };

  return (
    <main className="w-full h-svh bg-9 flex items-center justify-center">
      <section className='w-full h-full sm:w-[482px] sm:h-[512px] bg-1 sm:rounded-[10px] flex flex-col items-center max-sm:justify-center' >
        <ReactSVG
          className="mt-10"
          src="/src/assets/svg/image 1.svg"
        />
        <Form style='flex flex-col w-[90%]' onSubmit={authentication} >
          <div className='mt-14 w-full gap-5 flex flex-col' >
            <Input name='E-mail:' value={email} onchange={handleEmail} placeholder='Ex: admin@admin.com' type='email' key="email" />
            <div className='flex flex-col' >
              <Input name='Senha:' value={password} onchange={handlePassword} placeholder='' type='password' key="password" />
              <a className='text-white text-end mr-3 hover:underline' href="/EsqueceuSenha">Esqueceu sua senha?</a>
            </div>
          </div>
          <div className='flex w-full justify-end mt-10' >
          <Button children='Entrar' id='button' type='submit' />
        </div>
        
        </Form>
        {erro?(
          <p className='font-medium text-red-400 text-[20px] mt-2' >{erro}</p>
        ):null}
      </section>
    </main>
  )
}

export default Login;