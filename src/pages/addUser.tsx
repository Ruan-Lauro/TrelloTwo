import { ChangeEvent, FormEvent, useState } from "react";
import Form from "../components/form";
import InputAddUser from "../components/inputAddUser";
import LayoutPage from "../components/layoutPage";
import { SelectAddUser } from "../components/selectAddUser";
import ButtonAddUser from "../components/buttonAddUser";
import { useGetUser, userCreate } from "../hooks/useGetUser";
import { useNavigate } from "react-router-dom";


function AddUser (){

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [job, setJob] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [erro, setErro] = useState("");
    const {createUser} = useGetUser();
    const navigate = useNavigate();

    const handleName = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value);
    };
    
    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };

    const handleConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.currentTarget.value);
    };

    const handleJob = (e: ChangeEvent<HTMLSelectElement>) => {
        setJob(e.currentTarget.value);
    };


  
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if(password === confirmPassword){
        const user:userCreate = {
            nome:name,
            email:email,
            role: job==="Normaç"?0:1,
            senha: password
        }
        console.log(job)
        console.log(user)
       

        if(user){
            const res = await createUser(user);
            if(typeof res === "boolean" && res){
                alert("Usuário Criado")
            }else{
                setErro("Erro ao criar")
            }
        }
    }
  };

    return(
        <LayoutPage name="Criar Usuários" loadingValue={false} >
            <main className="p-6 bg-gray-100 h-full min-w-[300px]" >
                <header className="flex items-center justify-between" >
                        <h2 className="text-2xl text-[#003057] font-bold " >Criar Usuários</h2>                    
                </header>
                <main className="mt-10" >
                    <Form style={`bg-white px-6 sm:px-10 rounded-[10px] pt-5 pb-10`} onSubmit={handleCreateUser} >
                        <div className="flex flex-wrap justify-between gap-10" >
                            <InputAddUser name="Nome" onchange={handleName} value={name} placeholder="" type="text"></InputAddUser>
                            <InputAddUser name="E-mail" onchange={handleEmail} value={email} placeholder="" type="email"></InputAddUser>
                            <SelectAddUser list={["Administrador","Normal"]} name="Cargo" onchange={handleJob} value={job} />
                            <InputAddUser name="Senha" onchange={handlePassword} value={password} placeholder="" type="password"></InputAddUser>
                            <InputAddUser name="Confirmar Senha" onchange={handleConfirmPassword} value={confirmPassword} placeholder="" type="password"></InputAddUser>
                        </div>
                        <div className="w-full flex justify-between mt-20" >
                            <ButtonAddUser type="button" authentication={()=>{
                                  navigate(-1);
                            }} > Voltar </ButtonAddUser>
                            <ButtonAddUser type="submit" > Salvar </ButtonAddUser>
                        </div>
                        {erro !== ""?(
                            <p className="text-center text-red-700 font-semibold" >{erro}</p>
                        ):null}
                    </Form>
                </main>
            </main>
        </LayoutPage>
    );
}

export default AddUser;