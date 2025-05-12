import { GroupUser } from "../hooks/useGetGroup";
import { user } from "../hooks/useGetUser";
import ImgUser from "./imgUser";

type listUser = {
    list: GroupUser[];
    isAdmin: boolean;
    currentUser: user;
    handleRemoveUser: (userId: number)=>void;
}

const ListUser = ({currentUser, isAdmin, list, handleRemoveUser}:listUser) => {
 
    return(
        <div className="bg-white hidden lg:flex flex-col w-[313px] h-auto max-h-[50vh] rounded-[10px] ml-5 mr-5 px-5 py-5">
            <h2 className="text-2 font-bold text-[24px] mb-5">Membros do Grupo</h2>
            <div className="flex flex-col gap-4 h-[300px] overflow-y-auto pr-2">
                {list.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ImgUser color="bg-4" nome={member.nome} img={member.foto} id={member.id} />
                            <p className="font-bold text-[16px] truncate max-w-[150px]">{member.nome}</p>
                        </div>
                        
                        {isAdmin && member.nome !== currentUser?.name && (
                            <button 
                                onClick={() => handleRemoveUser(member.id)}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListUser;