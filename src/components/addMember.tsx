import { useEffect, useState } from "react";
import { useGetUser, userGet } from "../hooks/useGetUser";
import ImgUser from "./imgUser";
import { CardGetId } from "./showCard";


type addMember = {
    card: CardGetId;
};

const AddMember = ({card}:addMember) => {

    const [listUsers, setListUsers] = useState<userGet[]>();
    const {getListUserNoSearch} = useGetUser();

    useEffect(()=>{
        const list = getListUserNoSearch();
        list.then(res=>{
            if(res.items.length > 0){
                const listUser = new Set(card.membersList.map(user => user.id));
                console.log(listUser)
                const listRes = res.items.filter((user: { id: number; }) => !listUser.has(user.id));
                setListUsers(listRes);
            }   
        })
    },[])

    return(
        <div className="absolute w-[300px] flex flex-col bg-2/50 border-[1px] border-white/30 text-white rounded-[10px] mt-2 pb-5" >
            <p className="font-bold text-[18px] mt-3 text-center" >Membros</p>
            <div className="flex flex-col" >
                <p className="font-bold text-[18px] mt-5 text-4 mb-3 ml-3" >Adicionados:</p>
                {card.membersList.length > 0?(
                    <div className="flex flex-col gap-3 ml-3 w-[90%] min-h-[45px] max-h-[180px] overflow-y-auto custom-scroll-Two" >
                        {card.membersList.sort((a, b) =>
                        a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
                        ).map(val=>(
                            <div className="flex items-center justify-between " >
                                <div className="flex items-center gap-2" >
                                    <ImgUser id={val.id} img={val.foto} nome={val.nome} color="bg-4"/>
                                    <p className="text-[20px] font-semibold truncate max-w-[200px]" >{val.nome}</p>
                                </div>
                                <p className="font-bold text-[20px] justify-self-end" >X</p>
                            </div>
                        ))}
                    </div>
                ):null}
            </div>
            <div className="flex flex-col" >
                <p className="font-bold text-[18px] mt-5 text-white mb-3 ml-3" >Para Adicionar:</p>
                {listUsers && listUsers.length > 0?(
                    <div className="flex flex-col gap-3 ml-3 w-[90%] min-h-[40px] max-h-[180px] overflow-y-auto custom-scroll-Two" >
                        {listUsers.sort((a, b) =>
                        a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })
                        ).map(val=>(
                            <div className="flex items-center gap-2 " >
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

export default AddMember; 