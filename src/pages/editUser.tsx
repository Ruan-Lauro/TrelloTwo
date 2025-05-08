import { useNavigate, useParams } from "react-router-dom";
import LayoutPage from "../components/layoutPage";
import Form from "../components/form";
import ButtonAddUser from "../components/buttonAddUser";
import InputAddUser from "../components/inputAddUser";
import { SelectAddUser } from "../components/selectAddUser";
import { ChangeEvent, useEffect, useState } from "react";
import { useGetUser, userGet } from "../hooks/useGetUser";
import ShowWorkSpaceSelect from "../components/showWorkSpaceSelect";
import { workSpaceType } from "../components/selectMenuLeft";
import { useGetWorkSpace } from "../hooks/useGetWorkSpace";
import RenderWorkSpace from "../components/renderWorkSpace";
import StatusSelector from "../components/statusSelector";

export default function EditUser () {

    const {id} = useParams();
    const navigate = useNavigate();

    const {editUser, getUserId, getListUserNoSearch} = useGetUser();
    const [user, setUser] = useState<userGet>();
    const [inforUserWorkspace, setInforUserWorkspace] = useState<userGet>();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [job, setJob] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [erro, setErro] = useState("");
    const [listWorkSpace, setListWorkSpace] = useState<workSpaceType[]>([]);
    const {getWorkSpace} = useGetWorkSpace();
    const [update, setUpdate] = useState(false);
    const [openWorkSpaceIds, setOpenWorkSpaceIds] = useState<number[]>([]);
    const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo')
    const [passwordNew, setPasswordNew] = useState(false);

    const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };

    const handleConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.currentTarget.value);
    };

    const handleJob = (e: ChangeEvent<HTMLSelectElement>) => {
        setJob(e.currentTarget.value);
    };

    const handleEditUser = () => {
        if (!user || !inforUserWorkspace) return;
    
        const roleNumber = job === "Administrador" ? 1 : 0;
    
        if (passwordNew) {
            if (password === confirmPassword) {
                const res = editUser({
                    id: user.id,
                    senha: password,
                    workspaceIds: inforUserWorkspace.workplacesIds,
                    role: roleNumber,
                    ativo: status === "ativo"
                });
                res.then((val) => {
                    if (typeof val === "boolean" && val) {
                        setErro("");
                        setUpdate(!update);
                        setPassword("");
                        setConfirmPassword("");
                        setPasswordNew(false);
                    } else if (typeof val === "string") {
                        setErro(val);
                    }
                });
            } else {
                return setErro("Senhas diferentes");
            }
        } else {
            const res = editUser({
                id: user.id,
                workspaceIds: inforUserWorkspace.workplacesIds,
                role: roleNumber,
                ativo: status === "ativo"
            });

            console.log(roleNumber)

            res.then((val) => {
                if (typeof val === "boolean" && val) {
                    setErro("");
                    setUpdate(!update);
                } else if (typeof val === "string") {
                    setErro(val);
                }
            });
        }
    };
    

    useEffect(()=>{

        const resultUser = async () => {
            if(id){
                const res = await getUserId(parseInt(id));
                const resTwo = await getListUserNoSearch();

                if(typeof res !== "string" && typeof resTwo !== "string"){
                    console.log(res)
                    setUser(res);
                    setName(res.nome);
                    setEmail(res.email);
                    setJob(res.role === 1?"Administrador":"Normal");
                    setStatus(res.ativo?"ativo":"inativo");
                    setInforUserWorkspace(resTwo.items.filter((val: { id: number; })=>val.id===res.id)[0])
                }
                
                const list = getWorkSpace();
                list.then(value=>{
                    setListWorkSpace(value);
                })
            }
        }

        resultUser();
    },[id, update])

    const toggleWorkSpace = (id: number) => {
        setOpenWorkSpaceIds((prev) =>
          prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
      };

    return(
        <LayoutPage name="Editar Perfil" loadingValue={false} >
            <main className="p-6 bg-gray-100 h-full min-w-[300px] overflow-y-auto" >
                <header className="flex items-center justify-between" >
                        <h2 className="text-2xl text-[#003057] font-bold " >Editar Perfil</h2>                    
                </header>
                <main className="mt-10 " >
                    {inforUserWorkspace && user?(
                        <Form style={`bg-white px-6 sm:px-10 rounded-[10px] pt-5 pb-10 w-[1061px] max-2xl:w-full`} onSubmit={handleEditUser} >
                            <div className="ml-2 mb-7" >
                                <StatusSelector value={status} onChange={setStatus} />
                            </div>
                            <div className="flex flex-col justify-between gap-10 " >
                                <div className="flex max-lg:flex-col w-full justify-between gap-10" >
                                    <div className="flex flex-col text-1 w-full lg:max-w-[50%] overflow-hidden" >
                                        <p className="ml-2 font-semibold" >Nome:</p>
                                        <p className="pl-2 pb-1 text-[20px] text-black/40 border-b-[2px] border-b-1 " >{name}</p>
                                    </div>
                                    <div className="flex  flex-col text-1  w-full lg:max-w-[50%] overflow-hidden" >
                                        <p className="ml-2 font-semibold" >E-mail:</p>
                                        <p className="pl-2 pb-1 text-[20px] text-black/40 border-b-[2px] border-b-1" >{email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-10 max-lg:flex-col" >
                                    <SelectAddUser list={["Administrador","Normal"]} name="Cargo" onchange={handleJob} value={job} infor="e" />
                                    <div className="w-full" >
                                        <p className="ml-2 font-semibold text-1 mb-1" >Áreas de trabalho:</p>
                                        <div className="flex flex-col" >
                                            <RenderWorkSpace
                                                listWorkSpace={listWorkSpace}
                                                workplaceIds={inforUserWorkspace.workplacesIds}
                                                onClick={() => toggleWorkSpace(inforUserWorkspace.id)}
                                                seeAllWorkSpace={openWorkSpaceIds.includes(inforUserWorkspace.id)}
                                            />
                                            {openWorkSpaceIds.includes(inforUserWorkspace.id) && (
                                                <ShowWorkSpaceSelect
                                                listWorkSpace={listWorkSpace}
                                                workplaceIds={inforUserWorkspace.workplacesIds}
                                                userId={inforUserWorkspace.id}
                                                update={()=>{
                                                    setUpdate(!update);
                                                }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {passwordNew?(
                                    <div className="flex gap-10 w-full justify-between max-lg:flex-col" >
                                        <InputAddUser infor="n" name="Senha" onchange={handlePassword} value={password} placeholder="" type="password"></InputAddUser>
                                        <InputAddUser infor="n" name="Confirmar Senha" onchange={handleConfirmPassword} value={confirmPassword} placeholder="" type="password"></InputAddUser>
                                    </div>
                                ):null}
                                
                            </div>
                            <div className="w-full flex max-sm:items-center justify-between mt-20 max-sm:flex-col" >
                                <ButtonAddUser type="button" authentication={()=>{
                                    navigate(-1);
                                }} > Voltar </ButtonAddUser>
                                <div className="flex gap-5 max-sm:flex-col max-sm:mt-5" >
                                    <ButtonAddUser authentication={()=>{
                                        setPasswordNew(!passwordNew);
                                    }} type="button" > Resetar Senha </ButtonAddUser>
                                    <ButtonAddUser type="button" authentication={handleEditUser} > Salvar </ButtonAddUser>
                                </div>
                            </div>
                            {erro !== ""?(
                                <p className="text-center text-red-700 font-semibold" >{erro}</p>
                            ):null}
                        </Form>
                    ):null}
                </main>
                
            </main>
        </LayoutPage>
    );

}