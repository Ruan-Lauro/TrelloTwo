import { useNavigate } from "react-router-dom";
import LayoutPage from "../components/layoutPage";
import Form from "../components/form";
import ButtonAddUser from "../components/buttonAddUser";
import InputAddUser from "../components/inputAddUser";
import { ChangeEvent, useEffect, useState } from "react";
import { useGetUser, user, userEditPerfil } from "../hooks/useGetUser";

export default function EditProfile() {
    const navigate = useNavigate();
    const { getUser, editUserPerfil } = useGetUser();
    
    const [userData, setUserData] = useState<user | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState<File | null | string>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [update, setUpdate] = useState(0);
    const [error, setError] = useState("");

    const [passwordChange, setPasswordChange] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
              const token = localStorage.getItem("token");
            try {
                if(!token) return;
                setLoading(true);
                const data = await getUser(token);

                if (typeof data === "string") {
                    setError(data);
                } else if (data) {
                    setUserData(data);
                    setName(data.name);
                    setEmail(data.email);
                    setPhoto(data.photo); 
                    localStorage.setItem("user", JSON.stringify(data));
                    setUpdate(prev => prev + 1);
                }
            } catch (err) {
                setError("Erro ao carregar dados do usuário");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [success]);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setPhoto(file);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (passwordChange && password !== confirmPassword) {
            return setError("As senhas não coincidem");
        }

        try {
            const updatedUserData: userEditPerfil = {
                Nome: name,
                Email: email,
            };

            if(photo&&typeof photo !== "string"){
                updatedUserData.Foto = photo;
            }

            if (passwordChange && password) {
                updatedUserData.Senha = password;
            }

            const result = await editUserPerfil(updatedUserData);

            if (result === true) {
                setSuccess(true);
                if (passwordChange) {
                    setPassword("");
                    setConfirmPassword("");
                    setPasswordChange(false);
                }
            } else if (typeof result === "string") {
                setError(result === "user erro" ? "Erro nos dados do usuário" : "Erro no servidor");
            }
        } catch (err) {
            setError("Erro ao atualizar o perfil");
            console.error(err);
        }
    };

    return (
        <LayoutPage name="Meu Perfil" loadingValue={loading} updateHeader={update}>
            <main className="p-6 bg-gray-100 h-full min-w-[300px] overflow-y-auto">
                <header className="flex items-center justify-between">
                    <h2 className="text-2xl text-[#003057] font-bold">Meu Perfil</h2>
                </header>

                <main className="mt-10">
                    {userData && (
                        <Form style="bg-white px-6 sm:px-10 rounded-[10px] pt-5 pb-10 w-[1061px] max-2xl:w-full" onSubmit={handleSaveProfile}>
                            <div className="flex flex-col justify-between gap-10">
                                <div className="flex flex-col mb-10">
                                    <label className="font-semibold mb-2 text-2">Foto:</label>
                                    <div className="flex max-sm:flex-col items-center gap-4">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {photo ? (
                                                <img src={typeof photo === "string"?import.meta.env.VITE_LINK_API+photo:URL.createObjectURL(photo)} alt="Foto de perfil" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-400 text-4xl">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                            id="photoUpload"
                                        />
                                        <p className="text-[20px]" >Escolher foto de perfil</p>
                                        <label
                                            htmlFor="photoUpload"
                                            className="bg-black/10 text-black w-[163px] h-[43px] text-[20px] flex justify-center items-center rounded cursor-pointer hover:bg-black/20 transition-colors"
                                        >
                                            Procurar
                                        </label>
                                    </div>
                                </div>

                                <div className="flex max-lg:flex-col w-full justify-between gap-10">
                                    <InputAddUser 
                                        infor="n" 
                                        name="Nome" 
                                        onchange={handleNameChange} 
                                        value={name} 
                                        placeholder="Digite seu nome"
                                        type="text"
                                    />
                                    <InputAddUser 
                                        infor="n" 
                                        name="E-mail" 
                                        onchange={handleEmailChange} 
                                        value={email} 
                                        placeholder="Digite seu e-mail"
                                        type="text"
                                    />
                                </div>

                                {passwordChange && (
                                    <div className="flex gap-10 w-full justify-between max-lg:flex-col">
                                        <InputAddUser 
                                            infor="n" 
                                            name="Senha" 
                                            onchange={handlePasswordChange} 
                                            value={password} 
                                            placeholder="Digite sua nova senha" 
                                            type="password"
                                        />
                                        <InputAddUser 
                                            infor="n" 
                                            name="Confirmar Senha" 
                                            onchange={handleConfirmPasswordChange} 
                                            value={confirmPassword} 
                                            placeholder="Confirme sua nova senha" 
                                            type="password"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="w-full flex max-sm:items-center justify-between mt-20 max-sm:flex-col">
                                <ButtonAddUser 
                                    type="button" 
                                    authentication={() => navigate(-1)}
                                >
                                    Voltar
                                </ButtonAddUser>
                                <div className="flex gap-5 max-sm:flex-col max-sm:mt-5">
                                    <ButtonAddUser 
                                        authentication={() => setPasswordChange(!passwordChange)} 
                                        type="button"
                                    >
                                        {passwordChange ? "Cancelar" : "Alterar Senha"}
                                    </ButtonAddUser>
                                    <ButtonAddUser type="submit">
                                        Salvar
                                    </ButtonAddUser>
                                </div>
                            </div>

                            {error && (
                                <p className="text-center text-red-700 font-semibold mt-4">{error}</p>
                            )}

                            {success && (
                                <p className="text-center text-green-700 font-semibold mt-4">
                                    Perfil atualizado com sucesso!
                                </p>
                            )}
                        </Form>
                    )}
                </main>
            </main>
        </LayoutPage>
    );
}
