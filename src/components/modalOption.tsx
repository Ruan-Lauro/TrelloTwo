import { useNavigate } from "react-router-dom";

const ProfileSettingsModal = ({exit, isOpen}:{isOpen:boolean, exit:()=>void}) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    navigate("/");
  };

  const goToEditProfile = () => {
    navigate("/EditarPerfil");

  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-900">Opções de Perfil</h2>
                <button 
                  onClick={() => exit()}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3 ">
                <button 
                  onClick={goToEditProfile}
                  className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded flex items-center cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-3 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Editar Perfil
                </button>
                
                <div className="bg-1 text-white rounded cursor-pointer">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-3 rounded flex items-center cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettingsModal;