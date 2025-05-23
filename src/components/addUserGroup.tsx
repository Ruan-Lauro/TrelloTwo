import { userGet } from "../hooks/useGetUser";
import ImgUser from "./imgUser";

type addUserGroup = {
    handleAddUser:(userId: number)=>void;
    availableUsers: userGet[];
    setShowAddUserModal: ()=>void;
};

const AddUserGroup = ({handleAddUser, availableUsers, setShowAddUserModal}:addUserGroup) => {
    return(
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex sm:items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full sm:w-[90%] max-w-md max-sm:overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-1">Adicionar Usuário ao Grupo</h3>
                    <button 
                        onClick={setShowAddUserModal}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="sm:max-h-[60vh] sm:overflow-y-auto">
                    {availableUsers.length > 0 ? (
                        availableUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg mb-2">
                                <div className="flex items-center gap-3">
                                     <ImgUser color="bg-4" nome={user.nome} img={user.foto} id={user.id} />
                                    <p className="font-medium truncate max-w-[120px] sm:max-w-[180px]">{user.nome}</p>
                                </div>
                                
                                <button 
                                    onClick={() => handleAddUser(user.id)}
                                    className="bg-1 text-white px-3 py-1 rounded hover:bg-3 transition cursor-pointer"
                                >
                                    Adicionar
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">Nenhum usuário disponível para adicionar</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddUserGroup;