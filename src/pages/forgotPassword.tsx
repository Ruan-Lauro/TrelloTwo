import { ReactSVG } from 'react-svg';
import Input from '../components/input';
import { ChangeEvent, FormEvent, useState } from 'react';
import Button from '../components/button';
import Form from '../components/form';
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErro("Por favor, insira seu e-mail");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("E-mail inválido");
      return;
    }
    
    setErro("");
    alert("Instruções de recuperação enviadas para seu e-mail!");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <main className="w-full h-svh bg-9 flex items-center justify-center">
      <section className='w-full h-full sm:w-[482px] sm:h-[360px] bg-1 sm:rounded-[10px] flex flex-col items-center max-sm:justify-center'>
        <ReactSVG
          className="mt-10"
          src="/src/assets/svg/image 1.svg"
        />
        <Form style='flex flex-col sm:w-[90%]' onSubmit={handleSubmit}>
          <div className='mt-10 w-full gap-5 flex flex-col'>
            <div className='text-white text-center mb-2'>
              <h2 className='text-lg'>E-mail para recuperar senha</h2>
            </div>
            <Input 
              name='' 
              value={email} 
              onchange={handleEmail} 
              placeholder='Ex: admin@admin.com' 
              type='email' 
              key="email" 
            />
          </div>
          <div className='flex w-full justify-between mt-10'>
            <Button 
              children='Voltar' 
              id='button-back' 
              type='button' 
              authentication={handleBack}
            />
            <Button 
              children='Enviar' 
              id='button-send' 
              type='submit' 
            />
          </div>
        </Form>
        {erro ? (
          <p className='font-medium text-red-400 text-[20px] mt-2'>{erro}</p>
        ) : null}
      </section>
    </main>
  );
}

export default ForgotPassword;