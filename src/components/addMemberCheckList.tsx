import { ChangeEvent, useEffect, useState } from "react";
import { useGetUser, userGet } from "../hooks/useGetUser";
import ImgUser from "./imgUser";
import { Membro } from "./showCard";
import { useGetChecklistCard } from "../hooks/useGetCheckList";

type addMember = {
    listMember: Membro[];
    idChecklist: number;
    update: ()=>void;
    description: string;
};

const AddMemberCheckList = ({listMember, idChecklist, update, description}:addMember) => {

    const [listUsers, setListUsers] = useState<userGet[]>();
    const {getListUserNoSearch} = useGetUser();
    const [search, setSearch] = useState("");
    console.log(listMember)
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    const {addUserToChecklist, removeUserFromChecklist} = useGetChecklistCard();
    
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getListUserNoSearch();
    
            if (res.items && res.items.length > 0) {
                const memberIds = new Set((listMember || []).map(user => user.id));
    
                let filtered = res.items.filter((user: { id: number }) => !memberIds.has(user.id));
    
                if (search.trim() !== "") {
                    filtered = filtered.filter((user: { nome: string }) =>
                        user.nome.toLowerCase().includes(search.toLowerCase())
                    );
                }
    
                setListUsers(filtered);
    
            } else {
                setListUsers([]);
            }
        };
    
        fetchUsers();
    }, [search, listMember]);
    
    

    return(
        <div className="absolute top-[30%] z-10 w-[300px] flex flex-col bg-2 border-[1px] border-white/30 text-white rounded-[10px] mt-2 pb-5" >
            <p className="font-bold text-[18px] mt-3 text-center" >Membros CheckList</p>
            <p className="font-bold text-white/80 text-[18px] mt-3 text-center self-center max-w-[200px] truncate" >{description}</p>
            <input type="text" className="mt-5 self-center w-[90%] h-[35px] bg-white focus:outline-0 rounded-[5px] pl-3 placeholder:text-black/70 placeholder:font-semibold text-black" placeholder="Search" onChange={handleSearch} />
            <div className="flex flex-col" >
                <p className="font-bold text-[18px] mt-5 text-4 mb-3 ml-3" >Adicionados:</p>
                {listMember && listMember.length > 0?(
                    <div className="flex flex-col gap-3 ml-3 w-[90%] min-h-[45px] max-h-[100px] overflow-y-auto custom-scroll-Two" >
                        {listMember.sort((a, b) =>
                        a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
                        ).map(val=>(
                            <div className="flex items-center justify-between"  >
                                <div className="flex items-center gap-2" >
                                    <ImgUser id={val.id} img={val.foto} nome={val.nome} color="bg-4"/>
                                    <p className="text-[20px] font-semibold truncate max-w-[180px]" >{val.nome}</p>
                                </div>
                                <p className="font-bold text-[20px] justify-self-end hover:text-red-500 cursor-pointer mr-3" onClick={()=>{
                                    const res = removeUserFromChecklist(val.id);
                                    res.then(ele=>{
                                        if(typeof ele === "boolean" && ele){
                                            update();
                                        }
                                    })
                            }}  >X</p>
                            </div>
                        ))}
                    </div>
                ):null}
            </div>
            <div className="flex flex-col" >
                <p className="font-bold text-[18px] mt-5 text-white mb-3 ml-3" >Para Adicionar:</p>
                {listUsers && listUsers.length > 0?(
                    <div className="flex flex-col gap-3 ml-3 w-[90%] min-h-[40px] max-h-[100px] overflow-y-auto custom-scroll-Two" >
                        {listUsers.sort((a, b) =>
                        a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
                        ).map(val=>(
                            <div className="flex items-center gap-2 cursor-pointer hover:bg-1" onClick={()=>{
                                const res = addUserToChecklist({Id: idChecklist, UserId: val.id});
                                    res.then(ele=>{
                                        if(typeof ele === "boolean" && ele){
                                            update();
                                            alert("A api não está retornando os adicionados")
                                        }
                                    })
                            }} >
                                <ImgUser id={val.id} img={val.foto} nome={val.nome} color="bg-10" textColor="text-1"/>
                                <p className="text-[20px] font-semibold truncate max-w-[200px]" >{val.nome}</p>
                            </div>
                        ))}
                    </div>
                ):null}
            </div>   
        </div>
    );
}

export default AddMemberCheckList;